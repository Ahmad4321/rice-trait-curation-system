from django.urls import path,re_path
from django.conf import settings
from django.conf.urls.static import static


from .views import index,login_view,get_data,get_data_json,get_data_distinct,save_actions,register_view,logout_view,getevaluation_data,kimiAPIRequest,edit_evaluation

    

urlpatterns = [
    # Frontend
    path("", index, name="home"),
    path("home/", index, name="home"),
    path("guidlines/", index, name="home"),
    # Backend
    path("login/", login_view, name="login"),
    path("register/", register_view, name="register"),
    path("logout/", logout_view, name="logout"),
    path("get_data/", get_data, name="get_data"),
    path("fetch_trait_evalutation/", getevaluation_data, name="getevaluation_data"),
    path("get_data_json/", get_data_json, name="get_data_json"),
    path("curation_system_trait/",get_data_distinct,name="trait_list"),
    path("save_action_evaluation/",save_actions , name="save_actions"),
    path("api-request/",kimiAPIRequest,name="kimiAPIRequest"),
    path("edit-evaluation/",edit_evaluation,name="edit_evaluation")
    # path("rc_data/",get_rice_alterome_data,name="get_rice_alterome_data")
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)