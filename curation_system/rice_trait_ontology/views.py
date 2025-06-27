from django.shortcuts import render
from .models import *
from django.db.models import Q
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import authenticate, login,logout
from django.contrib.auth.models import User
# Create your views here.
import pandas as pd
import re
import textwrap

def index(request):
    return render(request,'index.html')


@csrf_exempt
def get_data(request):
    all_data = rtoData.objects.all().values()
    data = []
    for line in all_data:
        data.append({'id': int(line['id']), 'tag': line['TAG'], 'level': int(line['LEVEL']), 'title': f"{line['CNAME'] } ({line['ENAME']})",'name': f"{line['CNAME'] } ({line['ENAME']})",
                    'ename': line['ENAME'], 'TOID': line['TOID'], 'parentId': int(line['PARENTID'])})
    tree = {}
    for item in data:
        item['children'] = []
        tree[item['id']] = item

    for item in data:
        parent_id = item['parentId']
        if parent_id in tree:
            tree[parent_id]['children'].append(item)

    # 获取根节点
    root = [item for item in tree.values() if item['parentId'] == 0]

    context = {'code': 0, 'message': 'hello', 'count': len(data), 'data': root}

    return JsonResponse(context, safe=False)

@csrf_exempt
def get_data_json(request):
    # rto_list = rtoData.objects.all().values('id','tag', 'level', 'cname', 'ename', 'toid', 'parent_id','pubAnnotation_evidence','llm_evidence','rice_alterome_evidence','created_at','updated_at','created_by__username','updated_by__username','created_by__id','updated_by__id')

    rto_list = rtoData.objects.all().values('id','tag', 'level', 'cname', 'ename', 'toid', 'parent_id','pubAnnotation_evidence','llm_evidence','rice_alterome_evidence','created_at','updated_at')
    data = []

    for line in rto_list:
        
        data.append({'id': int(line['id']), 'tag': line['tag'], 'level': int(line['level']), 'title': f"{line['cname'] } ({line['ename']})", 'name': f"{line['cname'] } ({line['ename']})",
                    'ename': line['ename'], 'toid': line['toid'], 'parentId': int(line['parent_id']),'expanded' : False,
                    'pubAnnotation_evidence': line['pubAnnotation_evidence'],'llm_evidence': line['llm_evidence'],
                    'rice_alterome_evidence': line['rice_alterome_evidence'],'created_at': line['created_at'],'updated_at': line['updated_at']})

    #     data.append({'id': int(line['id']), 'tag': line['tag'], 'level': int(line['level']), 'title': f"{line['cname'] } ({line['ename']})", 'name': f"{line['cname'] } ({line['ename']})",
    #                 'ename': line['ename'], 'toid': line['toid'], 'parentId': int(line['parent_id']),'expanded' : False,
    #                 'pubAnnotation_evidence': line['pubAnnotation_evidence'],'llm_evidence': line['llm_evidence'],
    #                 'rice_alterome_evidence': line['rice_alterome_evidence'],'created_at': line['created_at'],'updated_at': line['updated_at'],
    #                 'created_by': line['created_by__username'],'updated_by': line['updated_by__username'],'created_by_id': line['created_by__id'],'updated_by_id': line['updated_by__id']})

    
    # for line in rto_list:
    #     data.append({'id': int(line.id), 'tag': line.tag, 'level': int(line.level), 'name': f"{line.cname } ({line.ename})",
    #                 'ename': line.ename, 'toid': line.toid, 'parentId': int(line.parent_id),
    #                 'pubAnnotation_evidence': line.pubAnnotation_evidence,'llm_evidence': line.llm_evidence,
    #                 'rice_alterome_evidence': line.rice_alterome_evidence,'created_at': line.created_at,'updated_at': line.updated_at,
    #                 'created_by': line.created_by.username,'updated_by': line.updated_by.username,'created_by_id': line.created_by.id,'updated_by_id': line.updated_by.id})

    # 构建树状结构
    tree = {}
    for item in data:
        item['children'] = []
        tree[item['id']] = item

    for item in data:
        parent_id = item['parentId']
        if parent_id in tree:
            tree[parent_id]['children'].append(item)

    # 获取根节点
    root = [item for item in tree.values() if item['parentId'] == 0]

    viewdata = {
        "name": "Root",
        "children": root
    }

    viewdata = viewdata #{'code': 0, 'message': 'hello', 'count': len(data), 'data': root}

    return JsonResponse(root, safe=False)


@csrf_exempt
def getevaluation_data(request):
    if request.method == "POST":
        data = json.loads(request.body)
        trait_id = data.get("trait_id")
        name = data.get("name") or ""
        match = re.search(r"\(([^)]+)\)", name)
        trait_name = match.group(1) if match else None
        all_data = TraitEvaluation.objects.filter(trait_id=trait_id).values('id','evaluation', 'expert_name', 'created_at', 'updated_at')
        data = []
        for line in all_data:
            data.append({'id': int(line['id']), 'evaluation': line['evaluation'], 'expert_name': line['expert_name'],
                        'created_at': line['updated_at']})
        rice_alterome_evidence = []
        pubannotation_evidence = []
        if trait_name!= "":
            #  rice Trait fetch iformation
            rice_trait_evidence = RiceAlteromePubannotation.objects.filter(alterome_trait_name=trait_name).values('id','alterome_PMID','alterome_RichSentence','alterome_sentence','alterome_title','pubannotation_target','pubannotation_source_db','pubannotation_project_name','alterome_Gene','pubannotation_text','alterome_TOTerm','alterome_GoTerm')
            for row in rice_trait_evidence:
                rice_alterome_evidence.append({'id':row['id'],'alterome_PMID': row['alterome_PMID'],'alterome_RichSentence': row['alterome_RichSentence'],'alterome_sentence': row['alterome_sentence'],'alterome_title': row['alterome_title'],'alterome_Gene': row['alterome_Gene'],"TOTerm":row['alterome_TOTerm'],"GOTerm":['alterome_GoTerm']})
                if row['pubannotation_text']:
                    pubannotation_evidence.append({'id':row['id'],'alterome_PMID': row['alterome_PMID'],'pubannotation_target': row['pubannotation_target'],'pubannotation_source_db': row['pubannotation_source_db'],'pubannotation_project_name': row['pubannotation_project_name'],'pubannotation_text': row['pubannotation_text']})
        
        # Remove duplicates
        Trait_information =  TraitExplaination.objects.filter(name__iexact= trait_name.lower()).values('comment','sentence','is_a','is_obsolete','name','synonym','trait_ontology_id','xref')
        Trait_information = [item for item in Trait_information]

        pubannotation_evidence = pd.DataFrame(pubannotation_evidence).drop_duplicates().to_dict(orient='records')

        # Fetch the exisitng  Record of the LLM Results

        # LLMTraitInfromtation

        LLM_trait_information = LLMTraitInfromtation.objects.filter(trait_id=trait_id).values("id",'LLM_Prompt','LLM_response','created_date','trait_id','trait_name')
        LLM_Trait_information = [item for item in LLM_trait_information]

        # LLM Prompt 

        print(Trait_information[0]['name'])

        llmPrompt = f"""You are expert in Plant Trait Ontology, I will provide the general information related to Trait you need to find the missing external resources and evidence related to mentioned trait.\n\n(Trait Information)\nTrait TO ID : {Trait_information[0]['trait_ontology_id']}\nTrait Name : {trait_name}\nTrait Definition : {Trait_information[0]['sentence']}\n\nProvide what kind of information you can find externally which is missing in RiceAlterome and PubAnnotation.Also Provide the following infromation,Whether this terms should be considered in RTO"""

        context = {'code': 0, 'message': 'hello','trait_val':trait_id,"trait_name":trait_name, 'count': len(data), 'data': data, "Trait_information" : Trait_information,'rice_alterome_evidence':rice_alterome_evidence,"pubannotation_evidence":pubannotation_evidence,"llmPrompt" : llmPrompt.strip(),"LLM_Trait_information":LLM_Trait_information}
        return JsonResponse(context)

    else:
        context = {'code': 0, 'message': 'hello', 'count': 0, 'data': []}
        return JsonResponse(context, safe=False)

@csrf_exempt
def get_data_distinct(request):
    if request.method == "GET":
        distinct_names = list(rtoData.objects.values('ename','cname').distinct())
            

        # 获取根节点
        root = [f"{item['cname'] } ({item['ename']})" for item in distinct_names]


        context = root #{'code': 0, 'message': 'hello', 'count': len(data), 'data': root}

        return JsonResponse(context, safe=False)
    else:
        return JsonResponse(context, safe=False)



def save_evalutation(comment,expert_name,user,trait_id):
    exper_name_value =   user.get("username") if user else expert_name
    user_id =  int(user.get("id")) if user else 3

    rto_instance = rtoData.objects.get(id=trait_id)
    # user = User.objects.get(id=user_id)

    # Saving and creating the evaluation against the trait
    evaluation_obj = TraitEvaluation.objects.create(
        evaluation=comment,
        trait_id= rto_instance,
        expert_name= exper_name_value,
        created_by= user_id,
        updated_by= user_id,
    )
    # print(evaluation_obj)
    evaluation_obj.save()
    return evaluation_obj

from django.utils import timezone
@csrf_exempt
def edit_evaluation(request):
    if request.method == 'PUT':
        data = json.loads(request.body)

        
        comment = data.get("comment")
        evo_id = data.get("evo_id")
        trait_id = data.get("trait_id")

        rto_instance = rtoData.objects.get(id=trait_id)


        evaluation_obj = TraitEvaluation.objects.filter(id=evo_id).update(
        evaluation=comment,
        trait_id= rto_instance,
        updated_at = timezone.now().date()
    )
        return JsonResponse({"data":"Data has been  updated"})
    else:
        return JsonResponse({'error': 'Invalid request method'})

def save_action_performed(action_code,action_name,user,trait_reference,is_active,is_resolved):
    rto_instance = rtoData.objects.get(id=trait_reference.get("id"))
    user_instance =  int(user.get("id")) if user else 3 #User.objects.get(id=user.get("id")) if user else User.objects.get(id=1)

    # parsed_trait_reference = json.loads(trait_reference)
    # trait_reference= parsed_trait_reference

    # Saving and creating the evaluation against the trait
    action_obj = ActionPerformed.objects.create(
        action_name=action_name,
        performed_by= user.get("username"),
        is_active= is_active,
        is_resolved= is_resolved,
        trait_id= rto_instance,
        trait_reference= trait_reference,
        created_by=user_instance,
        updated_by=user_instance
    )
    action_obj.save()
    return action_obj

@csrf_exempt
def save_actions(request):
    if request.method == "POST":
        data = json.loads(request.body)
        # print(data)
        comment = data.get("comment")
        expert_name = data.get("expert_name") 
        user = data.get("user")
        trait = data.get("trait")
        trait_id = trait.get("id")
        is_active = True
        is_resolved = True
        action_code = None
        action_name = None
        if data.get("function"):
            if data.get("function") == "add":
                action_code = "1001"
                action_name = data.get("function")  
            elif data.get("function") == "merge":
                action_code = "1002"
                action_name = data.get("function")
            elif data.get("function") == "remove":
                action_code = "1003"
                action_name = data.get("function")    
            elif data.get("function") == "remain":
                action_code = "1004"
                action_name = data.get("function")
            
            if action_code == "1004":
                is_active = False
                is_resolved = False
            
            save_action = save_action_performed(action_code,action_name,user,trait,is_active,is_resolved)
            saved_eval = save_evalutation(comment,expert_name,user,trait_id)

            return JsonResponse({'success': True,"evaluation": "saved", 'action_performed':"saved",'msg': "Thank you for your feedback! Your evaluation has been saved successfully. Incase of add/merge/remove, administrator will review your feedback and take action accordingly."})

        saved_eval = save_evalutation(comment,expert_name,user,trait_id)


        return JsonResponse({'success': True,"evaluation": "saved", 'action_performed':"saved",'msg': "Thank you for your feedback! Your evaluation has been saved successfully.",'evaluation': { 'id': saved_eval.id, 'evaluation': saved_eval.evaluation, 'expert_name': saved_eval.expert_name, 'created_at': saved_eval.created_at}})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'})


# Sigup module
@csrf_exempt
def register_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email)
        return JsonResponse({"message": "User created successfully"})


# Sign in module
@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)  # optional: sets session
            
            return JsonResponse({"message": "Login successful",'user': { 'id': user.id, 'username': user.username, 'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name }})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

# Logoutform
@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Logged out successfully'})
    else:            
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
# @csrf_exempt
# def get_rice_alterome_data(request):
#     if request.method == 'GET':
#         data = RiceAlteromeModelExternal.objects.filter(
#             Q(GOTerm__icontains='Sensitivity') | 
#             Q(TOTerm__icontains='Sensitivity') | 
#             Q(Sentence__icontains='Sensitivity')
#             ).values('Gene','PMID','Title','Sentence','GOTerm','TOTerm','RichSentence')[:100]
#         data = list(data)
#         return JsonResponse(data, safe=False)
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=400)


import requests
@csrf_exempt
def kimiAPIRequest(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        TraitId = data.get("trait_primary_id")
        llmPrompt = data.get("input_prompt")
        llmKey = data.get("llm_api_key")
        trait_name = data.get("trait_selected_name")
        tool = data.get("llm_tool")

        if  llmPrompt and llmKey and trait_name and TraitId:

            # Set the endpoint and headers
            url = ""
            headers = {}
            payload = {}
            if tool == "KIMI" :
                url = "https://api.moonshot.cn/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {llmKey}",
                    "Content-Type": "application/json"
                }

                # Define the request body
                payload = {
                    "model": "moonshot-v1-32k",  # or "moonshot-v1-32k" if moonshot-v1-8k you have access
                    "messages": [
                        {"role": "user", "content": llmPrompt}
                    ],
                    "temperature": 0.3
                }

            elif tool == "DEEPSEEK":
                url = "https://api.deepseek.com"
                headers = {
                    "Authorization": {llmKey},
                    "Content-Type": "application/json"
                }

                # Define the request body
                payload = {
                    "model": "deepseek-chat",  # or "moonshot-v1-32k" if moonshot-v1-8k you have access
                    "messages": [
                            {"role": "system", "content": "You are a helpful assistant"},
                            {"role": "user", "content": llmPrompt},
                        ],
                    "temperature": 1.0
                }
            else:
                return JsonResponse({"error": "Current system can only query KIMI or Deepseek"}, status=400)
            

            # Make the POST request
            try:
                response = requests.post(url, headers=headers, json=payload)
                message = ""

                # Handle response
                if response.status_code != 200:
                    return JsonResponse({"code":response.status_code, "error" : response.text, "result" : ""})
                if response.status_code == 200:
                    result = response.json()
                    message = result['choices'][0]['message']['content']

                    #  Insert the data into the database for the record

                    try:

                        llmobject = LLMTraitInfromtation.objects.create(
                            LLM_Prompt=llmPrompt,
                            LLM_response=message,
                            trait_id=TraitId,
                            trait_name=trait_name
                        )
                        print("LLM Object Created")
                    except Exception as e:
                        print(e)
                else:
                    print("Error:", response.status_code, response.text)
            
                return JsonResponse({"code":response.status_code,'result': message})
            except Exception as e:
                return JsonResponse({"error": "Found error in API KEY","status":500})
    return  JsonResponse({"error": "Invalid request method"}, status=400)