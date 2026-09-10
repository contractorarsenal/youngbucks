/* Young Bucks interactions */
(function(){
  "use strict";

  /* --- analytics helpers (safe no-ops if GA/Clarity aren't loaded) --- */
  function track(name,params){
    if(typeof window.gtag==="function"){ window.gtag("event",name,params||{}); }
  }
  function trackClarity(name){
    if(typeof window.clarity==="function"){ window.clarity("event",name); }
  }

  /* --- sticky nav (light -> dark after 40px) --- */
  var nav=document.querySelector(".nav");
  function onScroll(){ if(nav) nav.classList.toggle("scrolled",window.scrollY>40); }
  window.addEventListener("scroll",onScroll,{passive:true});
  onScroll();

  /* --- skip link --- */
  if(!document.querySelector(".skip-link")){
    var skip=document.createElement("a");
    skip.href="#main";
    skip.className="skip-link";
    skip.textContent="Skip to content";
    document.body.insertBefore(skip,document.body.firstChild);
  }
  if(!document.getElementById("main")){
    var landmark=document.querySelector("header.hero,header.contact-hero,header.page-hero,.hero-split");
    if(landmark) landmark.id="main";
  }

  /* --- mobile drawer (accessible: focus trap, Escape, aria-expanded, focus return) --- */
  var drawer=document.getElementById("drawer");
  var burger=document.getElementById("burger");
  var drawerLastFocus=null;
  function getFocusable(container){
    return Array.prototype.slice.call(container.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'));
  }
  function openDrawer(){
    if(!drawer) return;
    drawerLastFocus=document.activeElement;
    drawer.classList.add("open");
    document.body.style.overflow="hidden";
    if(burger) burger.setAttribute("aria-expanded","true");
    var panel=drawer.querySelector(".drawer-panel");
    var focusables=panel?getFocusable(panel):[];
    if(focusables.length) focusables[0].focus();
    document.addEventListener("keydown",onDrawerKeydown,true);
  }
  function closeDrawer(){
    if(!drawer) return;
    drawer.classList.remove("open");
    document.body.style.overflow="";
    if(burger) burger.setAttribute("aria-expanded","false");
    document.removeEventListener("keydown",onDrawerKeydown,true);
    if(drawerLastFocus&&typeof drawerLastFocus.focus==="function") drawerLastFocus.focus();
  }
  function onDrawerKeydown(e){
    if(!drawer.classList.contains("open")) return;
    if(e.key==="Escape"){ e.preventDefault(); closeDrawer(); return; }
    if(e.key==="Tab"){
      var panel=drawer.querySelector(".drawer-panel");
      var focusables=getFocusable(panel);
      if(!focusables.length) return;
      var first=focusables[0], last=focusables[focusables.length-1];
      if(e.shiftKey&&document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
  }
  if(burger&&drawer){
    burger.setAttribute("aria-expanded","false");
    burger.setAttribute("aria-controls","drawer");
    burger.addEventListener("click",function(){
      if(drawer.classList.contains("open")) closeDrawer(); else openDrawer();
    });
    var scrim=drawer.querySelector(".drawer-scrim");
    if(scrim) scrim.addEventListener("click",closeDrawer);
    var dc=document.getElementById("drawerClose");
    if(dc) dc.addEventListener("click",closeDrawer);
    drawer.querySelectorAll("a[href^='#'],a[href$='.html']").forEach(function(a){
      a.addEventListener("click",closeDrawer);
    });
  }

  /* --- smooth scroll (in-page anchors only) --- */
  document.querySelectorAll("a[href^='#']").forEach(function(a){
    a.addEventListener("click",function(e){
      var id=a.getAttribute("href");
      if(id.length<2) return;
      var el=document.querySelector(id);
      if(el){ e.preventDefault(); window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-90,behavior:"smooth"}); }
    });
  });

  /* --- scroll reveal --- */
  var revealEls=Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var vh0=window.innerHeight||document.documentElement.clientHeight;
  revealEls.forEach(function(el){
    if(el.getBoundingClientRect().top>vh0*0.85) el.classList.add("armed");
  });
  var armed=revealEls.filter(function(el){ return el.classList.contains("armed"); });
  function checkReveal(){
    var vh=window.innerHeight||document.documentElement.clientHeight;
    for(var i=armed.length-1;i>=0;i--){
      var r=armed[i].getBoundingClientRect();
      if(r.top<vh*0.9&&r.bottom>0){ armed[i].classList.add("in"); armed.splice(i,1); }
    }
  }
  var ticking=false;
  function onReveal(){ if(!ticking){ ticking=true; requestAnimationFrame(function(){ checkReveal(); ticking=false; }); } }
  window.addEventListener("scroll",onReveal,{passive:true});
  window.addEventListener("resize",onReveal);
  window.addEventListener("load",checkReveal);
  checkReveal();
  setTimeout(checkReveal,200);

  /* --- generic IntersectionObserver one-shot reveal (process steps, before/after pulse) --- */
  function onEnterOnce(el,cb){
    if(!("IntersectionObserver" in window)){ cb(); return; }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ cb(); io.unobserve(entry.target); }
      });
    },{threshold:.4});
    io.observe(el);
  }

  /* --- process timeline stagger reveal --- */
  document.querySelectorAll(".process-step").forEach(function(step,i){
    onEnterOnce(step,function(){
      setTimeout(function(){ step.classList.add("is-in"); },i*130);
    });
  });

  /* --- Google reviews: show more toggle --- */
  var grToggle=document.getElementById("grToggle");
  var grMore=document.getElementById("grMore");
  if(grToggle&&grMore){
    grToggle.addEventListener("click",function(){
      var expanded=grToggle.getAttribute("aria-expanded")==="true";
      grMore.hidden=expanded;
      grToggle.setAttribute("aria-expanded",String(!expanded));
      grToggle.innerHTML=expanded?'Read More Reviews <span class="arr">&rarr;</span>':'Show Fewer Reviews <span class="arr">&rarr;</span>';
      if(!expanded) grMore.scrollIntoView({behavior:"smooth",block:"start"});
    });
  }

  /* --- review carousel --- */
  var rcQuote=document.getElementById("rcQuote");
  if(rcQuote){
    var rcData=window.YB_REVIEWS||[];
    var rcAvatar=document.getElementById("rcAvatar");
    var rcName=document.getElementById("rcName");
    var rcDotsWrap=document.getElementById("rcDots");
    var rcIndex=0;
    var rcTimer;
    function renderDots(){
      rcDotsWrap.innerHTML="";
      rcData.forEach(function(_,i){
        var b=document.createElement("button");
        b.type="button";
        b.setAttribute("aria-label","Review "+(i+1));
        if(i===rcIndex) b.className="on";
        b.addEventListener("click",function(){ setReview(i); restartTimer(); });
        rcDotsWrap.appendChild(b);
      });
    }
    function setReview(i){
      rcIndex=(i+rcData.length)%rcData.length;
      var r=rcData[rcIndex];
      rcQuote.style.opacity=0;
      setTimeout(function(){
        rcQuote.textContent=r.quote;
        rcAvatar.textContent=r.initials;
        rcName.textContent=r.name;
        rcQuote.style.opacity=1;
      },180);
      Array.prototype.forEach.call(rcDotsWrap.children,function(d,di){ d.classList.toggle("on",di===rcIndex); });
    }
    function restartTimer(){ clearInterval(rcTimer); rcTimer=setInterval(function(){ setReview(rcIndex+1); },7000); }
    if(rcData.length){
      renderDots();
      setReview(0);
      restartTimer();
      var rcPrev=document.getElementById("rcPrev");
      var rcNext=document.getElementById("rcNext");
      if(rcPrev) rcPrev.addEventListener("click",function(){ setReview(rcIndex-1); restartTimer(); });
      if(rcNext) rcNext.addEventListener("click",function(){ setReview(rcIndex+1); restartTimer(); });
    }
  }

  /* --- gallery filmstrip --- */
  var filmstrip=document.getElementById("filmstrip");
  if(filmstrip){
    var fsData=window.YB_GALLERY||[];
    var fsIndex=0;
    var fsPrevImg=document.getElementById("fsPrev");
    var fsMainImg=document.getElementById("fsMain");
    var fsNextImg=document.getElementById("fsNext");
    var fsCounter=document.getElementById("fsCounter");
    var fsCaption=document.getElementById("fsCaption");
    function pad2(n){ return String(n).padStart(2,"0"); }
    function at(i){ return fsData[(i+fsData.length)%fsData.length]; }
    function renderFs(){
      var prev=at(fsIndex-1), cur=at(fsIndex), next=at(fsIndex+1);
      fsPrevImg.src=prev.src; fsPrevImg.alt=prev.alt;
      fsMainImg.src=cur.src; fsMainImg.alt=cur.alt;
      fsNextImg.src=next.src; fsNextImg.alt=next.alt;
      fsCounter.textContent=pad2(fsIndex+1)+" / "+pad2(fsData.length);
      fsCaption.textContent=cur.caption||"";
    }
    function go(delta){
      fsIndex=(fsIndex+delta+fsData.length)%fsData.length;
      renderFs();
      track("project_view",{page_path:location.pathname,index:fsIndex});
    }
    if(fsData.length){
      renderFs();
      var gp=document.getElementById("galleryPrev");
      var gn=document.getElementById("galleryNext");
      if(gp) gp.addEventListener("click",function(){ go(-1); });
      if(gn) gn.addEventListener("click",function(){ go(1); });
      filmstrip.querySelector(".fs-prev").addEventListener("click",function(){ go(-1); });
      filmstrip.querySelector(".fs-next").addEventListener("click",function(){ go(1); });
    }
  }

  /* --- before/after slider + tabs (accessible) --- */
  function clamp(v,lo,hi){ return Math.max(lo,Math.min(hi,v)); }
  var baPairs=Array.prototype.slice.call(document.querySelectorAll(".ba"));
  baPairs.forEach(function(ba){
    ba.querySelectorAll("img").forEach(function(img){
      img.setAttribute("draggable","false");
      img.style.pointerEvents="none";
    });
    var handle=ba.querySelector(".ba-handle");
    var dragging=false;
    var baInteracted=false;
    function reportBaInteraction(){
      if(baInteracted) return;
      baInteracted=true;
      track("before_after_interaction",{page_path:location.pathname});
    }
    function setSplit(clientX){
      var r=ba.getBoundingClientRect();
      var pct=clamp((clientX-r.left)/r.width*100, 2, 98);
      ba.style.setProperty("--split",pct+"%");
      ba.setAttribute("aria-valuenow",Math.round(pct));
    }
    function onDown(e){ e.preventDefault(); dragging=true; ba.setPointerCapture(e.pointerId); setSplit(e.clientX); reportBaInteraction(); }
    function onMove(e){ if(!dragging) return; e.preventDefault(); setSplit(e.clientX); }
    function onUp(){ dragging=false; }
    ba.addEventListener("pointerdown",onDown);
    ba.addEventListener("pointermove",onMove);
    ba.addEventListener("pointerup",onUp);
    ba.addEventListener("pointercancel",onUp);
    ba.addEventListener("touchstart",function(e){ e.preventDefault(); reportBaInteraction(); },{ passive:false });
    ba.addEventListener("touchmove",function(e){ e.preventDefault(); setSplit(e.touches[0].clientX); },{ passive:false });
    ba.setAttribute("role","slider");
    ba.setAttribute("tabindex","0");
    ba.setAttribute("aria-label","Drag to compare before and after");
    ba.setAttribute("aria-valuemin","0");
    ba.setAttribute("aria-valuemax","100");
    ba.setAttribute("aria-valuenow","50");
    ba.addEventListener("keydown",function(e){
      var current=parseFloat(ba.style.getPropertyValue("--split"))||50;
      var step=5;
      if(e.key==="ArrowLeft"){ e.preventDefault(); current=clamp(current-step,2,98); }
      else if(e.key==="ArrowRight"){ e.preventDefault(); current=clamp(current+step,2,98); }
      else if(e.key==="Home"){ e.preventDefault(); current=2; }
      else if(e.key==="End"){ e.preventDefault(); current=98; }
      else if(e.key==="0"){ e.preventDefault(); current=50; }
      else return;
      ba.style.setProperty("--split",current+"%");
      ba.setAttribute("aria-valuenow",Math.round(current));
      reportBaInteraction();
    });
    if(handle){
      onEnterOnce(ba,function(){
        handle.classList.add("pulse-once");
        setTimeout(function(){ handle.classList.remove("pulse-once"); },1200);
      });
    }
  });

  /* --- FAQ accordion (single open, CSS grid-rows handles the animation) --- */
  document.querySelectorAll(".faq-q").forEach(function(q){
    q.addEventListener("click",function(){
      var item=q.closest(".faq-item");
      var isOpen=item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(function(i){
        i.classList.remove("open");
        var btn=i.querySelector(".faq-q");
        if(btn) btn.setAttribute("aria-expanded","false");
      });
      if(!isOpen){
        item.classList.add("open");
        q.setAttribute("aria-expanded","true");
      }
    });
    q.addEventListener("keydown",function(e){
      if(e.key==="Enter"||e.key===" "){ e.preventDefault(); q.click(); }
    });
  });

  /* ============================================================
     QUOTE MODAL  (5-step wizard, shared by every "Get a Free
     Estimate" CTA sitewide)
     ============================================================ */
  var QM_SERVICES=[
    {id:"tree",label:"Tree Service"},
    {id:"retaining-wall",label:"Retaining Wall"},
    {id:"landscaping",label:"Landscaping"},
    {id:"irrigation",label:"Irrigation"},
    {id:"hardscaping",label:"Hardscaping"},
    {id:"snow-seasonal",label:"Snow / Seasonal"},
    {id:"not-sure",label:"Not Sure Yet"}
  ];
  var QM_TIMELINES=[
    {id:"asap",label:"ASAP"},
    {id:"30-days",label:"Within 30 Days"},
    {id:"1-3-months",label:"1–3 Months"},
    {id:"planning",label:"Just Planning"}
  ];
  var QM_STEPS=[
    {label:"Location"},{label:"Project"},{label:"Timeline"},{label:"Details"},{label:"Contact"}
  ];

  (function initQuoteModal(){
    var backdrop=document.getElementById("qmBackdrop");
    if(!backdrop) return;
    var modal=backdrop.querySelector(".qm-modal");
    var closeBtn=document.getElementById("qmClose");
    var progressEl=document.getElementById("qmProgress");
    var bodyEl=document.getElementById("qmBody");
    var footerEl=document.getElementById("qmFooter");
    var lastFocus=null;
    var step=1;
    var submitted=false;
    var data={zip:"",service:"",timeline:"",details:"",photoName:"",firstName:"",lastName:"",phone:"",email:""};
    var errors={};

    function renderProgress(){
      progressEl.innerHTML="";
      QM_STEPS.forEach(function(s,i){
        var n=i+1;
        var wrap=document.createElement("div");
        wrap.className="qm-step-ind"+(n===step?" active":"")+(n<step?" done":"");
        wrap.innerHTML='<div class="qm-step-circle">'+(n<step?'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>':n)+'</div><div class="qm-step-lbl">'+s.label+"</div>";
        progressEl.appendChild(wrap);
      });
    }

    function fieldRow(label,id,type,extra){
      extra=extra||{};
      var err=errors[id];
      return '<div class="qm-field-group">'+
        '<label class="qm-label" for="qm_'+id+'">'+label+'</label>'+
        '<input class="qm-input" id="qm_'+id+'" name="'+id+'" type="'+type+'" value="'+(data[id]||"").replace(/"/g,"&quot;")+'"'+
        (extra.placeholder?' placeholder="'+extra.placeholder+'"':'')+
        (extra.autocomplete?' autocomplete="'+extra.autocomplete+'"':'')+
        (extra.inputmode?' inputmode="'+extra.inputmode+'"':'')+
        ' aria-invalid="'+(err?"true":"false")+'"'+(err?' aria-describedby="qm_'+id+'_err"':'')+'>'+
        (err?'<span class="qm-err" id="qm_'+id+'_err">'+err+'</span>':'')+
        '</div>';
    }

    function renderStep(){
      renderProgress();
      var html="";
      if(step===1){
        html+='<h3>Where Is The Project?</h3><span class="qm-sub">Enter your ZIP code so we can confirm your service area.</span>';
        html+=fieldRow("ZIP Code*","zip","text",{placeholder:"98801",inputmode:"numeric",autocomplete:"postal-code"});
      } else if(step===2){
        html+='<h3>What Can We Help With?</h3><span class="qm-sub">Choose the service that fits best.</span>';
        html+='<div class="qm-card-grid" role="group" aria-label="Service">';
        QM_SERVICES.forEach(function(s){
          html+='<button type="button" class="qm-card'+(data.service===s.id?" sel":"")+'" data-service="'+s.id+'">'+
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" style="display:'+(data.service===s.id?'block':'none')+'"/><circle cx="12" cy="12" r="9" style="display:'+(data.service===s.id?'none':'block')+'"/></svg>'+
            s.label+'</button>';
        });
        html+='</div>';
        if(errors.service) html+='<span class="qm-err">'+errors.service+'</span>';
      } else if(step===3){
        html+='<h3>When Are You Looking To Start?</h3><span class="qm-sub">This helps us plan your site visit.</span>';
        html+='<div class="qm-card-grid" role="group" aria-label="Timeline">';
        QM_TIMELINES.forEach(function(t){
          html+='<button type="button" class="qm-card'+(data.timeline===t.id?" sel":"")+'" data-timeline="'+t.id+'">'+t.label+'</button>';
        });
        html+='</div>';
        if(errors.timeline) html+='<span class="qm-err">'+errors.timeline+'</span>';
      } else if(step===4){
        html+='<h3>Tell Us About The Project</h3><span class="qm-sub">Optional, but it helps us prep for your estimate.</span>';
        html+='<textarea class="qm-textarea" id="qm_details" name="details" placeholder="Size, scope, access, anything we should know...">'+(data.details||"")+'</textarea>';
        html+='<label class="qm-file-label" for="qm_photo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg><span>'+(data.photoName?data.photoName:"Attach a photo (optional)")+'</span><input type="file" id="qm_photo" name="photo" accept="image/*"></label>';
      } else if(step===5){
        if(submitted){
          html+='<div class="qm-success"><div class="qm-success-icon"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg></div>'+
            '<h3>Request Received.</h3>'+
            '<p>Thanks, '+(data.firstName||"there")+'. Young Bucks received your project request and will follow up within one business day. For an active tree emergency, call <a href="tel:+15094705684" style="color:var(--red);font-weight:700">(509) 470-5684</a>.</p>'+
            '<button type="button" class="btn btn-ink" id="qmDone">Close</button></div>';
        } else {
          html+='<h3>Tell Us How To Reach You</h3><span class="qm-sub">We\'ll follow up to confirm your estimate.</span>';
          html+='<div class="qm-field-row">'+
            fieldRow("First Name*","firstName","text",{autocomplete:"given-name"})+
            fieldRow("Last Name*","lastName","text",{autocomplete:"family-name"})+
          '</div>';
          html+='<div class="qm-field-row">'+
            fieldRow("Phone*","phone","tel",{placeholder:"(509) 000-0000",autocomplete:"tel"})+
            fieldRow("Email*","email","email",{autocomplete:"email"})+
          '</div>';
        }
      }
      bodyEl.innerHTML=html;
      bindStepInputs();
      renderFooter();
    }

    function bindStepInputs(){
      if(step===1){
        var zip=document.getElementById("qm_zip");
        if(zip) zip.addEventListener("input",function(){ data.zip=zip.value; });
      } else if(step===2){
        bodyEl.querySelectorAll("[data-service]").forEach(function(btn){
          btn.addEventListener("click",function(){ data.service=btn.getAttribute("data-service"); renderStep(); });
        });
      } else if(step===3){
        bodyEl.querySelectorAll("[data-timeline]").forEach(function(btn){
          btn.addEventListener("click",function(){ data.timeline=btn.getAttribute("data-timeline"); renderStep(); });
        });
      } else if(step===4){
        var ta=document.getElementById("qm_details");
        if(ta) ta.addEventListener("input",function(){ data.details=ta.value; });
        var file=document.getElementById("qm_photo");
        if(file) file.addEventListener("change",function(){
          data.photoName=file.files&&file.files[0]?file.files[0].name:"";
          var lbl=bodyEl.querySelector(".qm-file-label span");
          if(lbl) lbl.textContent=data.photoName||"Attach a photo (optional)";
        });
      } else if(step===5&&!submitted){
        ["firstName","lastName","phone","email"].forEach(function(id){
          var el=document.getElementById("qm_"+id);
          if(el) el.addEventListener("input",function(){ data[id]=el.value; });
        });
      }
    }

    function validateStep(){
      errors={};
      if(step===1){
        if(!/^\d{5}$/.test((data.zip||"").trim())) errors.zip="Enter a valid 5-digit ZIP code.";
      } else if(step===2){
        if(!data.service) errors.service="Select a service to continue.";
      } else if(step===3){
        if(!data.timeline) errors.timeline="Select a timeline to continue.";
      } else if(step===5){
        if(!(data.firstName||"").trim()) errors.firstName="First name is required.";
        if(!(data.lastName||"").trim()) errors.lastName="Last name is required.";
        if(!/^[\d\s()+-]{7,}$/.test((data.phone||"").trim())) errors.phone="Enter a valid phone number.";
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((data.email||"").trim())) errors.email="Enter a valid email address.";
      }
      return Object.keys(errors).length===0;
    }

    function renderFooter(){
      if(step===5&&submitted){ footerEl.innerHTML=""; footerEl.style.display="none"; return; }
      footerEl.style.display="flex";
      var backHtml=step>1?'<button type="button" class="btn btn-outline" id="qmBack"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:2px"><path d="M15 18l-6-6 6-6"/></svg>Back</button>':'<span></span>';
      var nextLabel=step===5?"Request My Estimate":"Continue";
      footerEl.innerHTML=backHtml+'<button type="button" class="btn btn-red" id="qmNext">'+nextLabel+' <span class="arr">→</span></button>';
      var back=document.getElementById("qmBack");
      if(back) back.addEventListener("click",function(){ step=Math.max(1,step-1); renderStep(); });
      var next=document.getElementById("qmNext");
      if(next) next.addEventListener("click",onNext);
    }

    function onNext(){
      if(!validateStep()){ renderStep(); return; }
      if(step<5){
        if(step===1) track("quote_start",{page_path:location.pathname});
        step++;
        renderStep();
        return;
      }
      submitQuote();
    }

    function submitQuote(){
      var next=document.getElementById("qmNext");
      if(next){ next.disabled=true; next.textContent="Sending..."; }
      var fd=new FormData();
      fd.append("access_key","REPLACE_WITH_REAL_WEB3FORMS_ACCESS_KEY");
      fd.append("subject","New estimate request from youngbuckslandscaping.com (quote modal)");
      fd.append("from_name","Young Bucks Website");
      fd.append("zip_code",data.zip);
      fd.append("service",data.service);
      fd.append("timeline",data.timeline);
      fd.append("details",data.details);
      fd.append("first_name",data.firstName);
      fd.append("last_name",data.lastName);
      fd.append("phone",data.phone);
      fd.append("email",data.email);
      fetch("https://api.web3forms.com/submit",{method:"POST",headers:{Accept:"application/json"},body:fd})
        .then(function(r){ return r.json(); })
        .then(function(res){
          if(res.success){
            submitted=true;
            track("generate_lead",{page_path:location.pathname,service:data.service});
            trackClarity("quote_submit");
            renderStep();
          } else {
            if(next){ next.disabled=false; next.textContent="Request My Estimate"; }
            alert("Something went wrong sending your request. Please call us at (509) 470-5684.");
          }
        })
        .catch(function(){
          if(next){ next.disabled=false; next.textContent="Request My Estimate"; }
          alert("Unable to send. Please call us at (509) 470-5684.");
        });
    }

    function getFocusableQm(){
      return Array.prototype.slice.call(modal.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'));
    }
    function onQmKeydown(e){
      if(!backdrop.classList.contains("open")) return;
      if(e.key==="Escape"){ e.preventDefault(); closeModal(); return; }
      if(e.key==="Tab"){
        var focusables=getFocusableQm();
        if(!focusables.length) return;
        var first=focusables[0], last=focusables[focusables.length-1];
        if(e.shiftKey&&document.activeElement===first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); }
      }
    }

    window.__qmIsOpen=false;
    function openModal(presetService){
      lastFocus=document.activeElement;
      step=1; submitted=false;
      errors={};
      data={zip:"",service:presetService||"",timeline:"",details:"",photoName:"",firstName:"",lastName:"",phone:"",email:""};
      backdrop.classList.add("open");
      backdrop.setAttribute("aria-hidden","false");
      document.body.style.overflow="hidden";
      window.__qmIsOpen=true;
      renderStep();
      document.addEventListener("keydown",onQmKeydown,true);
      setTimeout(function(){ var f=getFocusableQm(); if(f.length) f[0].focus(); },50);
      track("quote_open",{page_path:location.pathname});
      trackClarity("quote_open");
      closePromo();
    }
    function closeModal(){
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden","true");
      document.body.style.overflow="";
      window.__qmIsOpen=false;
      document.removeEventListener("keydown",onQmKeydown,true);
      if(lastFocus&&typeof lastFocus.focus==="function") lastFocus.focus();
    }

    bodyEl.addEventListener("click",function(e){
      if(e.target&&e.target.id==="qmDone") closeModal();
    });
    if(closeBtn) closeBtn.addEventListener("click",closeModal);
    backdrop.addEventListener("mousedown",function(e){ if(e.target===backdrop) closeModal(); });

    document.querySelectorAll("[data-open-quote]").forEach(function(trigger){
      trigger.addEventListener("click",function(e){
        e.preventDefault();
        openModal(trigger.getAttribute("data-service")||"");
        track("service_cta_click",{page_path:location.pathname,placement:trigger.getAttribute("data-placement")||"unknown"});
      });
    });

    window.YB_openQuoteModal=openModal;
  })();

  /* ============================================================
     PROMOTIONAL POPUP
     ============================================================ */
  var PROMO_KEY="youngBucks.promoPopupDismissed";
  function promoDismissed(){ try{ return sessionStorage.getItem(PROMO_KEY)==="1"; }catch(e){ return false; } }
  function setPromoDismissed(){ try{ sessionStorage.setItem(PROMO_KEY,"1"); }catch(e){} }
  function closePromo(){
    var pb=document.getElementById("promoBackdrop");
    if(pb) pb.classList.remove("open");
  }

  (function initPromo(){
    var backdrop=document.getElementById("promoBackdrop");
    if(!backdrop||promoDismissed()) return;
    var closeBtn=document.getElementById("promoClose");
    var dismissBtn=document.getElementById("promoDismiss");
    var form=document.getElementById("promoForm");
    var errEl=document.getElementById("promoErr");
    var shown=false;

    function show(){
      if(shown||promoDismissed()||window.__qmIsOpen) return;
      shown=true;
      backdrop.classList.add("open");
      backdrop.setAttribute("aria-hidden","false");
      trackClarity("promo_shown");
    }
    function dismiss(){
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden","true");
      setPromoDismissed();
    }

    var delay=12000+Math.random()*6000;
    var timer=setTimeout(show,delay);
    function onScrollTrigger(){
      var doc=document.documentElement;
      var scrolled=(doc.scrollTop)/(doc.scrollHeight-doc.clientHeight);
      if(scrolled>=0.45){
        clearTimeout(timer);
        window.removeEventListener("scroll",onScrollTrigger);
        show();
      }
    }
    window.addEventListener("scroll",onScrollTrigger,{passive:true});

    if(closeBtn) closeBtn.addEventListener("click",dismiss);
    if(dismissBtn) dismissBtn.addEventListener("click",dismiss);
    backdrop.addEventListener("mousedown",function(e){ if(e.target===backdrop) dismiss(); });
    document.addEventListener("keydown",function(e){
      if(e.key==="Escape"&&backdrop.classList.contains("open")) dismiss();
    });

    if(form){
      form.addEventListener("submit",function(e){
        e.preventDefault();
        var emailInput=document.getElementById("promoEmail");
        var email=(emailInput.value||"").trim();
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          errEl.textContent="Enter a valid email address.";
          errEl.style.display="block";
          return;
        }
        errEl.style.display="none";
        var fd=new FormData();
        fd.append("access_key","REPLACE_WITH_REAL_WEB3FORMS_ACCESS_KEY");
        fd.append("subject","New newsletter signup from youngbuckslandscaping.com popup");
        fd.append("from_name","Young Bucks Website Popup");
        fd.append("email",email);
        var btn=form.querySelector("[type=submit]");
        if(btn){ btn.disabled=true; btn.textContent="Sending..."; }
        fetch("https://api.web3forms.com/submit",{method:"POST",headers:{Accept:"application/json"},body:fd})
          .then(function(r){ return r.json(); })
          .then(function(res){
            var successEl=document.getElementById("promoSuccess");
            if(res.success&&successEl){
              form.hidden=true;
              successEl.hidden=false;
              setPromoDismissed();
              track("generate_lead",{page_path:location.pathname,source:"promo_popup"});
            } else if(btn){ btn.disabled=false; btn.textContent="Send Me The Updates"; }
          })
          .catch(function(){ if(btn){ btn.disabled=false; btn.textContent="Send Me The Updates"; } });
      });
    }
  })();

  /* ============================================================
     FLOATING CONTACT BUTTON
     ============================================================ */
  (function initFab(){
    var fab=document.getElementById("fab");
    if(!fab) return;
    var btn=document.getElementById("fabBtn");
    var menu=fab.querySelector(".fab-menu");
    function toggle(open){
      fab.classList.toggle("open",open);
      btn.setAttribute("aria-expanded",String(open));
    }
    function showFab(){ if(window.scrollY>400) fab.classList.add("is-visible"); else fab.classList.remove("is-visible"); }
    window.addEventListener("scroll",showFab,{passive:true});
    showFab();
    btn.addEventListener("click",function(){ toggle(!fab.classList.contains("open")); });
    document.addEventListener("click",function(e){
      if(fab.classList.contains("open")&&!fab.contains(e.target)) toggle(false);
    });
    document.addEventListener("keydown",function(e){
      if(e.key==="Escape"&&fab.classList.contains("open")){ toggle(false); btn.focus(); }
    });
    menu.querySelectorAll('a[href^="tel:"]').forEach(function(a){
      a.addEventListener("click",function(){ track("click_to_call",{page_path:location.pathname,placement:"floating_button"}); trackClarity("phone_click"); });
    });
  })();

  /* --- Web3Forms AJAX submit (contact page inline form) --- */
  var contactForms=document.querySelectorAll(".w3f-form");
  contactForms.forEach(function(form){
    var started=false;
    form.addEventListener("focusin",function(){
      if(started) return;
      started=true;
      track("quote_start",{page_path:location.pathname});
      trackClarity("quote_open");
    },{once:true});

    form.addEventListener("submit",function(e){
      e.preventDefault();
      var btn=form.querySelector("[type=submit]");
      var success=form.nextElementSibling;
      if(btn){ btn.disabled=true; btn.textContent="Sending..."; }
      fetch("https://api.web3forms.com/submit",{
        method:"POST",
        headers:{ "Accept":"application/json" },
        body:new FormData(form)
      })
      .then(function(r){ return r.json(); })
      .then(function(data){
        if(data.success){
          form.style.display="none";
          if(success) success.hidden=false;
          track("generate_lead",{page_path:location.pathname});
          trackClarity("quote_submit");
        } else {
          if(btn){ btn.disabled=false; btn.textContent="Send Request"; }
          alert("Something went wrong sending your request. Please call us at (509) 470-5684.");
        }
      })
      .catch(function(){
        if(btn){ btn.disabled=false; btn.textContent="Send Request"; }
        alert("Unable to send. Please call us at (509) 470-5684.");
      });
    });
  });

  /* --- click-to-call / email tracking --- */
  function placementFor(el){
    if(el.closest(".mobile-cta-bar")) return "mobile_bar";
    if(el.closest(".fab")) return "floating_button";
    if(el.closest(".nav")) return "header";
    if(el.closest(".hero-split,.hero,.contact-hero,.page-hero")) return "hero";
    if(el.closest(".footer")) return "footer";
    if(el.closest(".drawer")) return "mobile_menu";
    if(el.closest(".form-card,.contact-info-block")) return "contact_page";
    if(el.closest(".final-cta,.util-bar")) return "cta_section";
    return "body";
  }
  document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
    a.addEventListener("click",function(){
      track("click_to_call",{page_path:location.pathname,placement:placementFor(a)});
      trackClarity("phone_click");
    });
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
    a.addEventListener("click",function(){
      track("email_click",{page_path:location.pathname,placement:placementFor(a)});
    });
  });
  document.querySelectorAll(".svc-more").forEach(function(a){
    a.addEventListener("click",function(){
      var title=a.closest(".svc")?a.closest(".svc").querySelector(".svc-title"):null;
      track("service_cta_click",{page_path:location.pathname,service:title?title.textContent:undefined});
    });
  });

  /* --- mobile conversion bar (injected once, all pages) --- */
  if(!document.querySelector(".mobile-cta-bar")){
    var bar=document.createElement("div");
    bar.className="mobile-cta-bar";
    bar.innerHTML=
      '<a href="tel:+15094705684" class="mcb-call">Call Now</a>'+
      '<button type="button" class="mcb-quote" data-open-quote data-placement="mobile_bar">Get Free Estimate</button>';
    document.body.appendChild(bar);
    bar.querySelectorAll('a[href^="tel:"]').forEach(function(a){
      a.addEventListener("click",function(){
        track("click_to_call",{page_path:location.pathname,placement:"mobile_bar"});
        trackClarity("phone_click");
      });
    });
    bar.querySelector(".mcb-quote").addEventListener("click",function(e){
      e.preventDefault();
      if(window.YB_openQuoteModal) window.YB_openQuoteModal();
    });
  }

  /* --- year stamp --- */
  var y=document.getElementById("yr");
  if(y) y.textContent=new Date().getFullYear();
})();
