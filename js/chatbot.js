// Serenity Research Labs - Research Compound Advisor Chatbot
(function() {
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  const RESPONSES = {
    "peptide_signaling": {
      title: "Peptide Signaling Research",
      text: "Two widely studied compounds in cytoprotection and cell migration signaling pathways:",
      recs: [
        { name: "BPC-157", desc: "Gastric pentadecapeptide (15 amino acids) — extensively studied in murine models for cytoprotective and nitric oxide signaling pathways. 5mg lyophilized.", price: "$44.99", link: "../product_detail_bpc_157/code.html" },
        { name: "TB-500", desc: "Synthetic thymosin beta-4 fragment — investigated for actin-sequestering properties and cell migration modulation in preclinical research. 5mg lyophilized.", price: "$49.99", link: "../product_detail_tb500/code.html" }
      ]
    },
    "receptor_studies": {
      title: "Receptor Pathway Research",
      text: "Compounds targeting specific receptor subtypes for pharmacological characterization:",
      recs: [
        { name: "CJC/Ipamorelin", desc: "GHRH analog + ghrelin mimetic blend — dual-pathway secretagogue studied for GHRH-R and GHS-R1a receptor binding and pulsatile signaling patterns. 5mg blend.", price: "$54.99", link: "../product_detail_cjcipa/code.html" },
        { name: "Retatrutide", desc: "Triple-agonist incretin — GLP-1R, GIPR, and GCGR binding profiles under investigation. One of the most novel multi-receptor peptides in current research. 5mg.", price: "$65.00", link: "../product_detail_retatrutide/code.html" }
      ]
    },
    "matrix_remodeling": {
      title: "Extracellular Matrix Research",
      text: "Compounds studied in connective tissue signaling and extracellular matrix remodeling:",
      recs: [
        { name: "GHK-Cu", desc: "Copper-binding tripeptide (Gly-His-Lys) — researched for fibroblast signaling, copper chelation, and gene expression modulation in tissue culture. 50mg.", price: "$39.99", link: "../product_detail_ghkcu/code.html" },
        { name: "G-LOW", desc: "Multi-compound research blend: 10mg TB-500 + 10mg BPC-157 + 50mg GHK-Cu (70mg total). Three independently studied compounds in a single lyophilized preparation.", price: "$89.99", link: "../product_detail_glow/code.html" }
      ]
    },
    "melanocortin": {
      title: "Melanocortin Receptor Research",
      text: "Compounds targeting the melanocortin receptor family (MC1R–MC5R):",
      recs: [
        { name: "MT-2", desc: "Cyclic heptapeptide analog of alpha-MSH — non-selective melanocortin receptor agonist studied for MC1R and MC4R binding affinity and signaling cascades. 10mg.", price: "$34.99", link: "../product_detail_mt2/code.html" }
      ]
    },
    "growth_factor": {
      title: "Growth Factor Research",
      text: "Recombinant peptides studied for IGF-1 receptor signaling and cell proliferation kinetics:",
      recs: [
        { name: "IGF-1 LR3", desc: "Long R3 IGF-1 analog (83 amino acids) — Arg3 substitution reduces IGFBP binding, extending bioavailability in research assays. Recombinant, 1mg.", price: "$59.99", link: "../product_detail_igf1lr3/code.html" }
      ]
    },
    "compound_blends": {
      title: "Pre-Configured Research Kits",
      text: "Curated compound combinations based on commonly co-cited research protocols. All kits include bacteriostatic water for reconstitution:",
      recs: [
        { name: "View All Research Kits", desc: "See our full catalog of multi-compound research kits with volume pricing.", price: "From $49.99", link: "../pricing_stacks/code.html" }
      ]
    },
    "bpc": {
      title: "BPC-157 Compound Profile",
      text: "BPC-157 is a 15-amino acid gastric pentadecapeptide (Body Protection Compound) derived from human gastric juice. It has been extensively studied in preclinical models for cytoprotective signaling, nitric oxide pathway modulation, and soft tissue interaction research. One of the most cited peptides in current literature.",
      recs: [
        { name: "BPC-157", desc: "5mg lyophilized, 99%+ purity via HPLC, COA included.", price: "$44.99", link: "../product_detail_bpc_157/code.html" }
      ]
    },
    "default": {
      title: "Research Compound Advisor",
      text: "I can help you navigate our catalog of research-grade peptides. Select a research category below or type a compound name for detailed information.",
      recs: []
    }
  };

  function matchResponse(input) {
    const lower = input.toLowerCase();
    if (lower.includes("bpc") || lower.includes("157") || lower.includes("gastric")) return RESPONSES.bpc;
    if (lower.includes("signal") || lower.includes("cytoprotect") || lower.includes("cell migrat") || lower.includes("tb") || lower.includes("thymosin")) return RESPONSES.peptide_signaling;
    if (lower.includes("receptor") || lower.includes("ghrh") || lower.includes("ghrelin") || lower.includes("glp") || lower.includes("incretin") || lower.includes("cjc") || lower.includes("ipa") || lower.includes("retatr") || lower.includes("secreta")) return RESPONSES.receptor_studies;
    if (lower.includes("matrix") || lower.includes("collagen") || lower.includes("fibroblast") || lower.includes("ghk") || lower.includes("copper") || lower.includes("glow") || lower.includes("g-low") || lower.includes("connective")) return RESPONSES.matrix_remodeling;
    if (lower.includes("melanocort") || lower.includes("mt-2") || lower.includes("melanotan") || lower.includes("msh") || lower.includes("mc1r") || lower.includes("mc4r") || lower.includes("pigment")) return RESPONSES.melanocortin;
    if (lower.includes("igf") || lower.includes("growth factor") || lower.includes("lr3") || lower.includes("proliferat")) return RESPONSES.growth_factor;
    if (lower.includes("stack") || lower.includes("bundle") || lower.includes("combo") || lower.includes("kit") || lower.includes("blend") || lower.includes("package")) return RESPONSES.compound_blends;
    if (lower.includes("ship") || lower.includes("deliver")) return { title: "Shipping Info", text: "All orders ship within 24 hours in temperature-controlled packaging. Most US orders arrive in 2-4 business days. Flat rate shipping: $7.99.", recs: [] };
    if (lower.includes("payment") || lower.includes("pay") || lower.includes("card") || lower.includes("crypto")) return { title: "Payment Methods", text: "We accept Visa, Mastercard, Amex, Apple Pay, and select cryptocurrencies (BTC, ETH). All transactions are encrypted and PCI-compliant.", recs: [] };
    if (lower.includes("coa") || lower.includes("certificate") || lower.includes("test") || lower.includes("purity") || lower.includes("hplc") || lower.includes("lab")) return { title: "Purity & COAs", text: "Every batch is third-party tested via HPLC and Mass Spectrometry. Certificates of Analysis are included with every order and available on request for any batch.", recs: [] };
    if (lower.includes("promo") || lower.includes("code") || lower.includes("discount") || lower.includes("coupon")) return { title: "Promo Codes", text: "Use code SERENITY15 at checkout for 15% off your order. Follow us on TikTok and Instagram for exclusive promotions.", recs: [] };
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
      .srl-disclaimer { font-size:9px; color:#556; text-align:center; padding:8px 16px 12px; border-top:1px solid rgba(255,255,255,0.04); }
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
        <h3>Compound Advisor</h3>
        <p>Research Catalog Navigator</p>
      </div>
      <div id="srl-chat-body"></div>
      <div id="srl-chat-input-wrap">
        <input id="srl-chat-input" placeholder="Search compounds or ask a question..." type="text"/>
        <button id="srl-chat-send"><span class="material-symbols-outlined icon">send</span></button>
      </div>
      <div class="srl-disclaimer">For research purposes only. Not for human consumption.</div>
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
        resp.recs.forEach(function(r) {
          html += `<div class="srl-rec"><h4>${r.name}</h4><span class="price">${r.price}</span><p>${r.desc}</p><a href="${r.link}">View Details</a></div>`;
        });
      }
      msg.innerHTML = html;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    function addUserMessage(text) {
      const msg = document.createElement('div');
      msg.className = 'srl-msg user';
      msg.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    function showWelcome() {
      body.innerHTML = '';
      const msg = document.createElement('div');
      msg.className = 'srl-msg bot';
      msg.innerHTML = `
        <div class="bubble">Welcome to Serenity Research Labs. Select a research category or type a compound name to explore our catalog.</div>
        <div class="srl-pills">
          <span class="srl-pill" data-q="peptide_signaling">Peptide Signaling</span>
          <span class="srl-pill" data-q="receptor_studies">Receptor Studies</span>
          <span class="srl-pill" data-q="matrix_remodeling">Matrix Research</span>
          <span class="srl-pill" data-q="melanocortin">Melanocortin</span>
          <span class="srl-pill" data-q="growth_factor">Growth Factors</span>
          <span class="srl-pill" data-q="compound_blends">Research Kits</span>
        </div>
      `;
      body.appendChild(msg);
      msg.querySelectorAll('.srl-pill').forEach(function(pill) {
        pill.addEventListener('click', function() {
          const key = this.getAttribute('data-q');
          addUserMessage(this.textContent);
          setTimeout(function() { addBotMessage(RESPONSES[key]); }, 400);
        });
      });
    }

    function handleSend() {
      const text = input.value.trim();
      if (!text) return;
      addUserMessage(text);
      input.value = '';
      setTimeout(function() { addBotMessage(matchResponse(text)); }, 500);
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
