'use strict';

document.addEventListener("DOMContentLoaded", () => {
  /**
   * navbar toggle
   */
  const navOpenBtn = document.querySelector("[data-nav-open-btn]");
  const navbar = document.querySelector("[data-navbar]");
  const navCloseBtn = document.querySelector("[data-nav-close-btn]");

  if (navOpenBtn && navbar && navCloseBtn) {
    const navElemArr = [navOpenBtn, navCloseBtn];
    for (let i = 0; i < navElemArr.length; i++) {
      navElemArr[i].addEventListener("click", function () {
        navbar.classList.toggle("active");
      });
    }
  }

  /**
   * toggle navbar when click any navbar link
   */
  const navbarLinks = document.querySelectorAll("[data-nav-link]");
  if (navbarLinks) {
    for (let i = 0; i < navbarLinks.length; i++) {
      navbarLinks[i].addEventListener("click", function () {
        navbar.classList.remove("active");
      });
    }
  }

  /**
   * header active when window scrolled down
   */
  const header = document.querySelector("[data-header]");
  if (header) {
    window.addEventListener("scroll", function () {
      window.scrollY >= 50 ? header.classList.add("active")
        : header.classList.remove("active");
    });
  }

  /**
   * See More / See Less Toggle for Publications
   */
  const seeMoreBtn = document.querySelector("#see-more-btn");
  const publicationList = document.querySelector("#publication-list");

  if (seeMoreBtn && publicationList) {
    seeMoreBtn.addEventListener("click", function() {
      const allItems = publicationList.querySelectorAll("li");
      const icon = seeMoreBtn.querySelector("ion-icon");
      const isExpanding = icon.getAttribute("name") === "arrow-down";
      const lang = languageSelect ? languageSelect.value : 'en';

      allItems.forEach((item, index) => {
        if (index >= 5) {
          if (isExpanding) {
            item.removeAttribute("hidden");
            item.style.display = "block";
          } else {
            item.setAttribute("hidden", "");
            item.style.display = "none";
          }
        }
      });

      if (isExpanding) {
        seeMoreBtn.querySelector("span").textContent = translations[lang]["see-less-btn"];
        icon.setAttribute("name", "arrow-up");
      } else {
        seeMoreBtn.querySelector("span").textContent = translations[lang]["see-more-btn"];
        icon.setAttribute("name", "arrow-down");
        document.querySelector("#event").scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /**
   * Language Switcher Logic
   */
  const languageSelect = document.querySelector("#language-select");

  function updateLanguage(lang) {
    const tElements = document.querySelectorAll("[data-t]");
    tElements.forEach(el => {
      const key = el.getAttribute("data-t");
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    const pElements = document.querySelectorAll("[data-t-placeholder]");
    pElements.forEach(el => {
      const key = el.getAttribute("data-t-placeholder");
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    // Update document language attribute
    document.documentElement.lang = lang;
  }

  if (languageSelect) {
    languageSelect.addEventListener("change", function () {
      updateLanguage(this.value);
    });
  }

  /**
   * AI Assistant Logic
   */
  const assistantBtn = document.querySelector("#assistant-btn");
  const assistantChat = document.querySelector("#assistant-chat");
  const closeChat = document.querySelector("#close-chat");
  const chatInput = document.querySelector("#chat-input");
  const sendChat = document.querySelector("#send-chat");
  const chatBody = document.querySelector("#chat-body");

  if (assistantBtn && assistantChat && closeChat && chatInput && sendChat && chatBody) {
    
    assistantBtn.addEventListener("click", () => assistantChat.classList.toggle("active"));
    closeChat.addEventListener("click", () => assistantChat.classList.remove("active"));

    const addMessage = (text, sender) => {
      const msgDiv = document.createElement("div");
      msgDiv.classList.add("message", sender);
      msgDiv.textContent = text;
      chatBody.appendChild(msgDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    };

    const generateResponse = (inputText) => {
      const lang = languageSelect ? languageSelect.value : 'en';
      const query = inputText.toLowerCase().trim().replace(/[?.,!]/g, "");
      
      const intents = [
        {
          id: "contact",
          keywords: ["contact", "email", "phone", "whatsapp", "wechat", "reach", "number", "message", "call", "联系", "联系我", "邮箱", "电话", "微信号"],
          response: lang === 'zh' 
            ? `您可以通过他的大学邮箱联系沙希德博士：**${ASSISTANT_DATA.profile.email}**。\n直拨电话：${ASSISTANT_DATA.profile.phone} \nWhatsApp: ${ASSISTANT_DATA.profile.whatsapp}`
            : `You can reach Dr. Shahid at his university email: **${ASSISTANT_DATA.profile.email}**. \nDirect Phone: ${ASSISTANT_DATA.profile.phone} \nWhatsApp: ${ASSISTANT_DATA.profile.whatsapp}`
        },
        {
          id: "education",
          keywords: ["phd", "education", "study", "degree", "thesis", "uibe", "university", "pide", "iub", "masters", "博士", "教育", "研究", "学位", "论文", "大学", "硕士"],
          response: lang === 'zh'
            ? `沙希德博士在 ${ASSISTANT_DATA.education[0].institution} 获得了 ${ASSISTANT_DATA.education[0].degree}。他的论文重点是 “${ASSISTANT_DATA.education[0].thesis}”。`
            : `Dr. Shahid earned his ${ASSISTANT_DATA.education[0].degree} from ${ASSISTANT_DATA.education[0].institution}. His thesis focused on "${ASSISTANT_DATA.education[0].thesis}".`
        },
        {
          id: "experience",
          keywords: ["work", "experience", "job", "career", "who", "world health", "tsinghua", "peking", "consultant", "工作", "经验", "职业", "世卫组织", "世界卫生组织", "清华", "北大", "顾问"],
          response: lang === 'zh'
            ? `沙希德在 **世界卫生组织 (WHO)** 拥有 5 年以上的经验，并曾在中国顶尖大学工作。`
            : `Shahid has over 5 years of experience with the **World Health Organization (WHO)** and has worked at leading universities in China.`
        },
        {
          id: "research",
          keywords: ["research", "interest", "field", "nutrition", "malnutrition", "child", "policy", "econometrics", "研究", "研究领域", "利息", "营养", "健康", "儿童", "政策", "计量经济学"],
          response: lang === 'zh'
            ? `他的主要研究兴趣包括 **${ASSISTANT_DATA.research_impact.key_areas.join(", ")}**。`
            : `His primary research interests include **${ASSISTANT_DATA.research_impact.key_areas.join(", ")}**.`
        },
        {
          id: "impact",
          keywords: ["impact", "citation", "scholar", "h-index", "index", "publications", "articles", "papers", "引用", "学者", "指标", "发表论文", "发表", "论文", "文章"],
          response: lang === 'zh'
            ? `他在 Google Scholar 上拥有超过 **${ASSISTANT_DATA.research_impact.citations} 次引用**，H 指数为 ${ASSISTANT_DATA.research_impact.h_index}。`
            : `He has over **${ASSISTANT_DATA.research_impact.citations} citations** on Google Scholar with an h-index of ${ASSISTANT_DATA.research_impact.h_index}.`
        },
        {
          id: "skills",
          keywords: ["skill", "software", "stata", "r", "python", "ai", "machine learning", "deep learning", "spss", "技能", "软件", "人工智能", "机器学习", "深度学习"],
          response: lang === 'zh'
            ? `他是 **${ASSISTANT_DATA.skills.slice(0, 4).join(", ")}** 以及高级 AI 建模方面的专家。`
            : `He is expert in software like **${ASSISTANT_DATA.skills.slice(0, 4).join(", ")}** and advanced AI modeling.`
        },
        {
          id: "cv",
          keywords: ["cv", "resume", "download", "简历", "下载"],
          response: lang === 'zh'
            ? "您可以从页头按钮下载沙希德博士的简历。如果您愿意，我也可向您介绍他的博士研究内容！"
            : "You can download Dr. Shahid's CV from the header button. I can also tell you about his PhD research if you'd like!"
        },
        {
          id: "greeting",
          keywords: ["hi", "hello", "hey", "greetings", "你好", "您好"],
          response: lang === 'zh'
            ? "您好！我是沙希德的虚拟助手。向我询问有关他的博士学位、世卫组织工作或研究兴趣的问题吧！"
            : "Hi there! I'm Shahid's virtual assistant. Ask me about his PhD, WHO work, or research interests!"
        }
      ];

      for (const intent of intents) {
        if (intent.keywords.some(k => query.includes(k))) {
          return intent.response;
        }
      }

      return lang === 'zh' 
        ? "我不太确定。作为本地助手，我主要了解沙希德的学术和职业背景。尝试询问“博士”或“世卫组织”。"
        : "I'm not exactly sure about that. Since I'm a local assistant, I mainly know about Shahid's academic and professional background. Try asking about 'PhD' or 'WHO'.";
    };

    const processMessage = (val) => {
      if (!val) return;

      addMessage(val, "user");
      chatInput.value = "";

      const thinking = document.createElement("div");
      thinking.classList.add("message", "assistant");
      thinking.textContent = "...";
      chatBody.appendChild(thinking);
      chatBody.scrollTop = chatBody.scrollHeight;

      setTimeout(() => {
        thinking.remove();
        const res = generateResponse(val);
        addMessage(res, "assistant");

        if (res.includes("not exactly sure") || res.includes("不太确定")) {
          const lang = languageSelect ? languageSelect.value : 'en';
          const btn = document.createElement("button");
          btn.textContent = lang === 'zh' ? `使用 Google AI 搜索` : `Search with Google AI`;
          btn.className = "btn btn-grey";
          btn.style.width = "100%";
          btn.onclick = () => {
            const searchTerms = `Health economist Muhammad Shahid Shenzhen University ${val}`;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerms)}`, "_blank");
          };
          chatBody.appendChild(btn);
          chatBody.scrollTop = chatBody.scrollHeight;
        }
      }, 700);
    };

    sendChat.addEventListener("click", () => processMessage(chatInput.value.trim()));
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") processMessage(chatInput.value.trim());
    });

    // Handle Quick Question Chips
    const qnChips = document.querySelectorAll(".qn-chip");
    qnChips.forEach(chip => {
      chip.addEventListener("click", () => processMessage(chip.innerText));
    });
  }
});
