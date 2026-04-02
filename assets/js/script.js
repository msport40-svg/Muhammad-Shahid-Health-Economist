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
      const isExpanding = seeMoreBtn.querySelector("span").textContent === "See More";

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
        seeMoreBtn.querySelector("span").textContent = "See Less";
        seeMoreBtn.querySelector("ion-icon").setAttribute("name", "arrow-up");
      } else {
        seeMoreBtn.querySelector("span").textContent = "See More";
        seeMoreBtn.querySelector("ion-icon").setAttribute("name", "arrow-forward");
        document.querySelector("#event").scrollIntoView({ behavior: 'smooth' });
      }
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
      const query = inputText.toLowerCase().trim().replace(/[?.,!]/g, "");
      
      const intents = [
        {
          id: "contact",
          keywords: ["contact", "email", "phone", "whatsapp", "wechat", "reach", "number", "message", "call"],
          response: `You can reach Dr. Shahid at his university email: **${ASSISTANT_DATA.profile.email}**. \nDirect Phone: ${ASSISTANT_DATA.profile.phone} \nWhatsApp: ${ASSISTANT_DATA.profile.whatsapp}`
        },
        {
          id: "education",
          keywords: ["phd", "education", "study", "degree", "thesis", "uibe", "university", "pide", "iub", "masters"],
          response: `Dr. Shahid earned his ${ASSISTANT_DATA.education[0].degree} from ${ASSISTANT_DATA.education[0].institution}. His thesis focused on "${ASSISTANT_DATA.education[0].thesis}".`
        },
        {
          id: "experience",
          keywords: ["work", "experience", "job", "career", "who", "world health", "tsinghua", "peking", "consultant"],
          response: `Shahid has over 5 years of experience with the **World Health Organization (WHO)** and has worked at leading universities in China.`
        },
        {
          id: "research",
          keywords: ["research", "interest", "field", "nutrition", "malnutrition", "child", "policy", "econometrics"],
          response: `His primary research interests include **${ASSISTANT_DATA.research_impact.key_areas.join(", ")}**.`
        },
        {
          id: "impact",
          keywords: ["impact", "citation", "scholar", "h-index", "index", "publications", "articles", "papers"],
          response: `He has over **${ASSISTANT_DATA.research_impact.citations} citations** on Google Scholar with an h-index of ${ASSISTANT_DATA.research_impact.h_index}.`
        },
        {
          id: "skills",
          keywords: ["skill", "software", "stata", "r", "python", "ai", "machine learning", "deep learning", "spss"],
          response: `He is expert in software like **${ASSISTANT_DATA.skills.slice(0, 4).join(", ")}** and advanced AI modeling.`
        },
        {
          id: "cv",
          keywords: ["cv", "resume", "download"],
          response: "You can download Dr. Shahid's CV from the header button. I can also tell you about his PhD research if you'd like!"
        },
        {
          id: "greeting",
          keywords: ["hi", "hello", "hey", "greetings"],
          response: "Hi there! I'm Shahid's virtual assistant. Ask me about his PhD, WHO work, or research interests!"
        }
      ];

      // Use a more strict matching to avoid first-match-only issues
      for (const intent of intents) {
        if (intent.keywords.some(k => query.includes(k))) {
          return intent.response;
        }
      }

      return "I'm not exactly sure about that. Since I'm a local assistant, I mainly know about Shahid's academic and professional background. Try asking about 'PhD' or 'WHO'.";
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

        if (res.includes("not exactly sure")) {
          const btn = document.createElement("button");
          btn.textContent = `Search with Google AI`;
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
