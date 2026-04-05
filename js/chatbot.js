// Serenity Research Labs - AI Product Advisor Chatbot
(function() {
  const RESPONSES = {
    "fat_loss": {
      title: "Fat Loss Research",
      text: "For metabolic and weight management research, two compounds dominate the literature:",
      recs: [
        { name: "G-LOW", desc: "GLP-1 receptor agonist — the most researched pathway for appetite regulation and metabolic optimization. 70mg concentration gives you serious research runway.", price: "$89.99", link: "../product_detail_glow/code.html" },
        { name: "Retatrutide", desc: "Triple-agonist hitting GLP-1, GIP, and glucagon receptors simultaneously. The most powerful metabolic compound in research right now.", price: "$65.00", link: "../product_detail_retatrutide/code.html" }
      ]
    },
    "recovery": {
      title: "Recovery Research",
      text: "The recovery stack is the bread and butter of peptide research. Two compounds that work synergistically:",
      recs: [
        { name: "BPC-157", desc: "The gold standard for tissue repair research — gastric pentadecapeptide that accelerates tendon, ligament, and muscle healing pathways.", price: "$44.99", link: "../product_detail_bpc_157/code.html" },
        { name: "TB-500", desc: "Thymosin Beta-4 fragment that promotes angiogenesis and reduces inflammation. Pair it with BPC-157 for the ultimate recovery protocol.", price: "$49.99", link: "../product_detail_tb500/code.html" }
      ]
    },
    "anti_aging": {
      title: "Anti-Aging Research",
      text: "Longevity and regeneration research focuses on two key pathways:",
      recs: [
        { name: "GHK-Cu", desc: "Copper peptide backed by 50+ studies — activates over 4,000 genes involved in tissue remodeling, collagen synthesis, and cellular repair.", price: "$39.99", link: "../product_detail_ghkcu/code.html" },
        { name: "CJC/Ipamorelin", desc: "Clean GH secretagogue blend that elevates growth hormone without spiking cortisol. Research shows improved sleep, body composition, and recovery.", price: "$54.99", link: "../product_detail_cjcipa/code.html" }
      ]
    },
    "muscle": {
      title: "Muscle Growth Research",
      text: "For hypertrophy and growth pathway research, these compounds target the key mechanisms:",
      recs: [
        { name: "IGF-1 LR3", desc: "Long-acting growth factor that activates satellite cells — the precursors to new muscle fiber formation. 3x longer half-life than native IGF-1.", price: "$59.99", link: "../product_detail_igf1lr3/code.html" },
        { name: "CJC/Ipamorelin", desc: "Synergistic GH blend that amplifies natural growth hormone output 2-3x. The foundation of any serious growth protocol.", price: "$54.99", link: "../product_detail_cjcipa/code.html" }
      ]
    },
    "skin": {
      title: "Skin & Appearance Research",
      text: "For skin quality, tanning, and appearance-focused research:",
      recs: [
        { name: "MT-2", desc: "Melanocortin agonist that triggers melanin production — achieve a deep, even tan without UV damage. Also researched for appetite modulation.", price: "$34.99", link: "../product_detail_mt2/code.html" },
        { name: "GHK-Cu", desc: "The regenerative copper peptide — 32% increase in collagen synthesis in research models. Skin elasticity, wound healing, and hair restoration.", price: "$39.99", link: "../product_detail_ghkcu/code.html" }
      ]
    },
    "bpc": {
      title: "BPC-157 Info",
      text: "BPC-157 is a 15-amino acid gastric pentadecapeptide researched for tissue repair, gut healing, and recovery acceleration. It's the most popular peptide we carry — most researchers start here. Pairs perfectly with TB-500 for a complete recovery stack.",
      recs: [
        { name: "BPC-157", desc: "5mg lyophilized, 99%+ purity, COA included", price: "$44.99", link: "../product_detail_bpc_157/code.html" }
      ]
    },
    "stacks": {
      title: "Our Pre-Built Stacks",
      text: "We've curated research stacks based on the most common protocols. Save 18-20% vs buying individually:",
      recs: [
        { name: "Gym Stack ($119.99)", desc: "BPC-157 + TB-500 + CJC/Ipa — the complete performance research protocol.", price: "$119.99", link: "../pricing_stacks/code.html" },
        { name: "Summer Stack ($69.99)", desc: "MT-2 + GHK-Cu + Bac Water — skin, tan, and appearance research.", price: "$69.99", link: "../pricing_stacks/code.html" }
      ]
    },
    "default": {
      title: "How Can I Help?",
      text: "I can recommend peptides based on your research goals. Try asking about: fat loss, recovery, muscle growth, anti-aging, skin & tanning, or our pre-built stacks. You can also ask about any specific compound.",
      recs: []
    }
  };

  function matchResponse(input) {
    const lower = input.toLowerCase();
    if (lower.includes("fat") || lower.includes("weight") || lower.includes("metaboli") || lower.includes("glp") || lower.includes("sema") || lower.includes("ozempic") || lower.includes("tirzepatide")) return RESPONSES.fat_loss;
    if (lower.includes("recover") || lower.includes("heal") || lower.includes("tendon") || lower.includes("joint") || lower.includes("injur")) return RESPONSES.recovery;
    if (lower.includes("age") || lower.includes("aging") || lower.includes("longev") || lower.includes("regenerat") || lower.includes("collagen")) return RESPONSES.anti_aging;
    if (lower.includes("muscle") || lower.includes("growth") || lower.includes("hypertrophy") || lower.includes("gain") || lower.includes("mass") || lower.includes("igf")) return RESPONSES.muscle;
    if (lower.includes("skin") || lower.includes("hair") || lower.includes("tan") || lower.includes("mt-2") || lower.includes("melanotan") || lower.includes("appearance")) return RESPONSES.skin;
    if (lower.includes("bpc") || lower.includes("157")) return RESPONSES.bpc;
    if (lower.includes("stack") || lower.includes("bundle") || lower.includes("combo") || lower.includes("package")) return RESPONSES.stacks;
    if (lower.includes("ship") || lower.includes("deliver")) return { title: "Shipping Info", text: "All orders ship within 24 hours in temperature-controlled, discreet packaging. Most US orders arrive in 2-4 business days. Free shipping on orders over $100.", recs: [] };
    if (lower.includes("payment") || lower.includes("pay") || lower.includes("card") || lower.includes("crypto")) return { title: "Payment Methods", text: "We accept Visa, Mastercard, Amex, Apple Pay, and select cryptocurrencies (BTC, ETH). All transactions are encrypted and PCI-compliant.", recs: [] };
    if (lower.includes("coa") || lower.includes("certificate") || lower.includes("test") || lower.includes("purity") || lower.includes("lab")) return { title: "Purity & COAs", text: "Every batch is third-party tested via HPLC and Mass Spectrometry. Certificates of Analysis are included with every order and available on request for any batch.", recs: [] };
    if (lower.includes("promo") || lower.includes("code") || lower.includes("discount") || lower.includes("coupon")) return { title: "Promo Codes", text: "Use code SERENITY15 at checkout for 15% off your order. Follow us on TikTok and Instagram for exclusive drops and additional codes.", recs: [] };
    return RESPONSES.default;
  }

  function createWidget() {
    const style = document.createElement('style');
    style.textContent = `
      #srl-chat-toggle { position:fixed; bottom:24px; right:24px; z-index:9999; width:60px; height:60px; border-radius:50%; background:#0078d4; border:none; cursor:pointer; box-shadow:0 4px 20px rgba(0,120,212,0.4); display:flex; align-items:center; justify-content:center; transition:all .2s; }
      #srl-chat-toggle:hover { transform:scale(1.08); box-shadow:0 6px 28px rgba(0,120,212,0.5); }
      #srl-chat-toggle .icon { color:white; font-size:28px; }
      #srl-chat-panel { position:fixed; bottom:100px; right:24px; z-index:9998; width:380px; max-height:520px; background:#141b2b; border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.3); display:none; flex-direction:column; overflow:hidden; font-family:'Inter',sans-serif; }
      #srl-chat-panel.open { display:flex; animation:slideUp .3s ease; }
      @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      #srl-chat-header { padding:20px; background:linear-gradient(135deg,#0078d4,#005faa); }
      #srl-chat-header h3 { color:white; font-size:16px; font-weight:800; margin:0 0 4px; letter-spacing:-0.02em; }
      #srl-chat-header p { color:rgba(255,255,255,0.7); font-size:11px; margin:0; text-transform:uppercase; letter-spacing:0.1em; font-weight:600; }
      #srl-chat-body { flex:1; overflow-y:auto; padding:16px; max-height:300px; }
      #srl-chat-body::-webkit-scrollbar { width:4px; }
      #srl-chat-body::-webkit-scrollbar-thumb { background:#334; border-radius:4px; }
      .srl-msg { margin-bottom:12px; }
      .srl-msg.bot .bubble { background:#1e2640; color:#c0c7d4; padding:12px 16px; border-radius:12px 12px 12px 4px; font-size:13px; line-height:1.5; }
      .srl-msg.user .bubble { background:#0078d4; color:white; padding:10px 16px; border-radius:12px 12px 4px 12px; font-size:13px; line-height:1.5; margin-left:40px; }
      .srl-rec { background:#1e2640; border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:12px; margin-top:8px; }
      .srl-rec h4 { color:white; font-size:14px; font-weight:700; margin:0 0 4px; }
      .srl-rec p { color:#8892a4; font-size:11px; margin:0 0 8px; line-height:1.4; }
      .srl-rec a { display:inline-block; background:#0078d4; color:white; text-decoration:none; padding:6px 16px; border-radius:6px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; }
      .srl-rec a:hover { background:#005faa; }
      .srl-rec .price { color:#a3c9ff; font-weight:700; font-size:13px; float:right; margin-top:-20px; }
      .srl-pills { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
      .srl-pill { background:rgba(0,120,212,0.15); color:#a3c9ff; border:1px solid rgba(0,120,212,0.3); padding:6px 14px; border-radius:20px; font-size:11px; font-weight:600; cursor:pointer; transition:all .15s; text-transform:uppercase; letter-spacing:0.04em; }
      .srl-pill:hover { background:rgba(0,120,212,0.3); color:white; }
      #srl-chat-input-wrap { padding:12px 16px; border-top:1px solid rgba(255,255,255,0.06); display:flex; gap:8px; }
      #srl-chat-input { flex:1; background:#1e2640; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px 14px; color:white; font-size:13px; font-family:'Inter',sans-serif; outline:none; }
      #srl-chat-input::placeholder { color:#556; }
      #srl-chat-input:focus { border-color:#0078d4; }
      #srl-chat-send { background:#0078d4; border:none; border-radius:8px; width:40px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
      #srl-chat-send:hover { background:#005faa; }
      #srl-chat-send .icon { color:white; font-size:18px; }
      @media (max-width:480px) { #srl-chat-panel { width:calc(100vw - 32px); right:16px; bottom:90px; } }
    `;
    document.head.appendChild(style);

    // Toggle button
    const toggle = document.createElement('button');
    toggle.id = 'srl-chat-toggle';
    toggle.innerHTML = '<span class="material-symbols-outlined icon">smart_toy</span>';
    document.body.appendChild(toggle);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'srl-chat-panel';
    panel.innerHTML = `
      <div id="srl-chat-header">
        <h3>Serenity AI Advisor</h3>
        <p>Peptide Research Assistant</p>
      </div>
      <div id="srl-chat-body"></div>
      <div id="srl-chat-input-wrap">
        <input id="srl-chat-input" placeholder="Ask about any peptide..." type="text"/>
        <button id="srl-chat-send"><span class="material-symbols-outlined icon">send</span></button>
      </div>
    `;
    document.body.appendChild(panel);

    const body = document.getElementById('srl-chat-body');
    const input = document.getElementById('srl-chat-input');
    let isOpen = false;

    function addBotMessage(resp) {
      const msg = document.createElement('div');
      msg.className = 'srl-msg bot';
      let html = `<div class="bubble"><strong>${resp.title}</strong><br>${resp.text}</div>`;
      if (resp.recs && resp.recs.length) {
        resp.recs.forEach(r => {
          html += `<div class="srl-rec"><h4>${r.name}</h4><span class="price">${r.price}</span><p>${r.desc}</p><a href="${r.link}">Shop ${r.name.split(' ')[0]}</a></div>`;
        });
      }
      msg.innerHTML = html;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    function addUserMessage(text) {
      const msg = document.createElement('div');
      msg.className = 'srl-msg user';
      msg.innerHTML = `<div class="bubble">${text}</div>`;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    function showWelcome() {
      body.innerHTML = '';
      const msg = document.createElement('div');
      msg.className = 'srl-msg bot';
      msg.innerHTML = `
        <div class="bubble">Not sure which peptide is right for your research goals? I can help. Pick a category or type your question below.</div>
        <div class="srl-pills">
          <span class="srl-pill" data-q="fat_loss">Fat Loss</span>
          <span class="srl-pill" data-q="recovery">Recovery</span>
          <span class="srl-pill" data-q="anti_aging">Anti-Aging</span>
          <span class="srl-pill" data-q="muscle">Muscle Growth</span>
          <span class="srl-pill" data-q="skin">Skin & Hair</span>
          <span class="srl-pill" data-q="stacks">View Stacks</span>
        </div>
      `;
      body.appendChild(msg);
      msg.querySelectorAll('.srl-pill').forEach(pill => {
        pill.addEventListener('click', function() {
          const key = this.getAttribute('data-q');
          addUserMessage(this.textContent);
          setTimeout(() => addBotMessage(RESPONSES[key]), 400);
        });
      });
    }

    function handleSend() {
      const text = input.value.trim();
      if (!text) return;
      addUserMessage(text);
      input.value = '';
      setTimeout(() => addBotMessage(matchResponse(text)), 500);
    }

    toggle.addEventListener('click', function() {
      isOpen = !isOpen;
      panel.classList.toggle('open', isOpen);
      if (isOpen && body.children.length === 0) showWelcome();
      toggle.innerHTML = isOpen
        ? '<span class="material-symbols-outlined icon">close</span>'
        : '<span class="material-symbols-outlined icon">smart_toy</span>';
    });

    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') handleSend(); });
    document.getElementById('srl-chat-send').addEventListener('click', handleSend);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createWidget);
  else createWidget();
})();
