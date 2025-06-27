import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "./Header";
import Footer from "./Footer";

const Section = ({
  titleEn,
  titleZh,
  contentEn,
  contentZh,
  pageLink,
  bgColor,
}) => (
  <Box sx={{ py: 6, px: 2, backgroundColor: bgColor || "white" }}>
    <Container>
      <Typography variant="h4" gutterBottom>
        {titleEn} {titleZh ? "/" + titleZh : ""}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {contentEn}
      </Typography>
      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
        {contentZh}
      </Typography>
      {pageLink && (
        <a href={pageLink} target="_blank" rel="noopener noreferrer">
          {pageLink}
        </a>
      )}
    </Container>
  </Box>
);
const AccordionSection = () => {
  const accordions = [
    {
      titleEn:
        "Use Case 1: Find new Rice Trait, collect evidence, and add as a new concept",
      titleZh: "概念增加",
      content: `Adding a new Trait to the trait ontology is a brainstorming process that involves gathering substantial evidence from diverse resources. Here is an example to show how.
  The trait name is “Seedling-stage submergence tolerance” in rice, which does not currently exist in RTO and represents the early-stage stress of water during seed germination. Evidence is derived from Rice-Alterome, PubAnnotation, and NCBI, reflecting over 100 results from these sources. These references portray it as a trait and link it to submergence tolerance, which is already included in the Rice Trait Ontology. Therefore, one may add a new trait under submergence tolerance, designating the trait “Seedling-stage submergence tolerance” as a child of the parent trait called submergence tolerance.`,
      ch: `向性状本体论中添加新性状是一个集思广益的过程，需要从多种来源收集大量证据。以下是一个示例说明其运作方式。
  有一个名为“Seedling-stage submergence tolerance/幼苗期淹水耐受性”的性状，目前在水稻性状本体论 (RTO) 中尚不存在。它代表了水稻种子萌发早期阶段的水压胁迫。证据来源于 Rice-Alterome、PubAnnotation 和 NCBI，这些来源总共提供了超过 100 条相关结果。这些参考文献将其描述为一个性状，并将其与“Seedling-stage submergence tolerance/淹水耐受性”联系起来，而“淹水耐受性”已包含在水稻性状本体论中。因此，可以将一个新性状添加到“淹水耐受性”之下，将“幼苗期淹水耐受性”指定为父性状“淹水耐受性”的子性状。`,
    },
    {
      titleEn:
        "Use Case 2: Found a similar meaning Trait, merge into the existing Trait",
      titleZh: "概念合并",
      content: `Consider a trait example of submergence sensitivity, which relates to the water tolerance trait. One of the traits named “submergence tolerance,” which most closely resembles “flooding tolerance,” acts as a synonym for submergence tolerance. 
  Evidence can be found in both Rice-Alterome and PubAnnotation, reflecting results related to flood tolerance in the rice crop. From the Rice-Alterome dataset, it shows 39 sentences and PMID, as well as the same number of genes associated with the traits submergence tolerance and flooding tolerance. Based on these evidence, one may be able to consider that it is the synonym of submergence tolerance and we can merge flooding tolerance into submergence tolerance.`,
      ch: `考虑一个与耐水性状相关的“淹水敏感性”性状示例。其中，“Submergence tolerance/淹水耐受性”这个性状与“Flooding tolerance/洪涝耐受性”非常相似，可以作为“淹水耐受性”的同义词。
  在Rice-Alterome 和 PubAnnotation 中都可以找到证据，这些结果都与水稻的洪涝耐受性相关。来自 Rice-Alterome 数据集的数据显示，有 39 个句子和 PMID，以及相同数量的基因与淹水耐受性和洪涝耐受性这两个性状相关联。基于这些证据，我们可以认为洪涝耐受性是淹水耐受性的同义词，并且可以将洪涝耐受性合并到淹水耐受性中。`,
    },
    {
      titleEn:
        "Use Case 3: Trait with insufficient evidence or duplicate trait",
      titleZh: "概念去除",
      content: `Removing a trait from the ontology system is a daunting task. A trait may be removed for the following reasons: i) Insufficient evidence found in the literature, resulting in experts wanting to retain it for future research, while sometimes preferring to remove it; ii) A trait that is considered a duplicate when multiple traits exist in the ontology may warrant removal.    
  Despite these considerations, unfortunately, the current rice trait ontology system does not contain any false traits that can be removed, whether they are duplicates or have inadequate literature evidence. But we appreciate rigorous checking from experts.`,
      ch: `从本体论系统中移除一个性状是一项艰巨的任务。移除某个性状的原因可能包括：
i) 文献中证据不足：这可能导致专家希望保留该性状以供未来研究，但也可能倾向于将其移除。 ii) 重复性状：当本体论中存在多个被认为是重复的性状时，也可能需要移除其中一个。
  尽管有这些考量，但令人欣慰的是，当前的水稻性状本体论系统未发现可以移除的错误性状，无论是重复的还是文献证据不足的。不过，我们仍然非常感谢专家的严格审查。`,
    },
    {
      titleEn: "Use Case 4: Same Trait and Same Definition, remain as is",
      titleZh: "概念保留",
      content: `Even if you find a trait to be impeccable in terms of its importance and logical placement, please still mark it as "Remain."`,
      ch: `如果您检查某个性状不论从重要性、位置合理性而言都无可挑剔，请仍然给予“Remain/保留”标记`,
    },
  ];

  return (
    <Box sx={{ py: 6, px: 2, backgroundColor: "#f5f5f5" }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Use cases/ 使用案例
        </Typography>
        {accordions.map((item, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx ={{ fontSize: '1.2rem' }}>
                {item.titleEn} / {item.titleZh}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {item.content}
                <br />
                {item.ch}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

const Introduction = () => {
  return (
    <>
      <Header />
      <Box paddingTop={3}>
        <Typography variant="h4" align="center">
          Introduction to the Curation System for Rice Trait Ontology /
          水稻性状本体RTO条目专家修订页面的说明
        </Typography>
      </Box>

      <Box sx={{ py: 6, px: 2 }}>
        <Section
          titleEn="What is RTO?"
          titleZh=""
          contentEn="RTO is short for Rice trait ontology, which is a trait ontology specifically for rice."
          contentZh=""
          bgColor="#e3f2fd"
          pageLink="http://127.0.0.1:8000/RiceTraitOntology/"
        />
        <Section
          titleEn="Main functions of RTO curation system"
          titleZh="水稻性状本体RTO修订系统的主要功能"
          contentEn="Rice curation system give the ability to rice trait ontology expert to interact the trait through web-page and formed a decision either this is valid trait and different function like 
i) ADD a new class, 
ii) MERGE into existing trait, 
iii) REMOVE the existing class/trait, 
iv) REMAIN as it is. 
 The curation system provide GUI to showcase the hierachical tree of RTO, and providing reference info related to the considered trait, and help the expert to form the decision regarding the existing trait or new class. This project is handled both from front and back-end where each term or trait will be integrated through Rice-Alterome and PubAnnotation through REST API. The back-end is developed in python Django and front-end is designed in ReactJs."
          contentZh="水稻性状管理系统旨在让水稻性状本体论专家能够通过网页与RTO提供的性状条目进行知识交互，形成决策，判断某个性状是否有效。系统提供以下功能：
i) 添加新的性状概念， 
ii) 合并到现有性状中， 
iii) 移除现有类别/性状， 
iv) 保持不变。
    修订系统提供RTO的本体条目树状结构，提供参考信息，帮助专家对现有性状或新类别做出决策。该项目涵盖前端和后端开发，其中每个术语或性状都将通过 Rice-Alterome 和 PubAnnotation 经由 REST API 进行整合。后端使用 Python Django 开发，前端则采用ReactJs"
          bgColor="#fff3e0"
        />
        <Section
          titleEn="Guideline for an expert/curator"
          titleZh="专家修订指南"
          contentEn="Step 1. Search or examines a concept in the rice trait ontology. 
Step 2. Check the importance or correctness of the concept, and leave the comment in the comment box.
Step 3. In case the expert needs external references, he or she may collect evidence from literature sources, including Rice-Alterome, and PubAnnotation. In some cases, if literature evidence is not found from the resources, the LLM can assist."
          contentZh=""
          bgColor="#e8f5e9"
        />
        <AccordionSection />
      </Box>

      <Footer />
    </>
  );
};

export default Introduction;
