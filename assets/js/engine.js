(function(){
  const state={cards:[],filter:'all'};

  function load(){
    fetch('../assets/data/cards.json')
      .then(r=>r.json())
      .then(cards=>{state.cards=cards;renderList();});
  }

  function renderList(){
    const list=document.getElementById('deckList');
    list.innerHTML='';
    const q=document.getElementById('query').value.toLowerCase();
    state.cards.filter(c=>{
      return (state.filter==='all'||c.suit===state.filter) && (!q||c.name.toLowerCase().includes(q));
    }).forEach(card=>{
      const btn=document.createElement('button');
      btn.textContent=card.name;
      btn.dataset.suit=card.suit;
      btn.addEventListener('click',()=>showCard(card));
      list.appendChild(btn);
    });
  }

  function showCard(card){
    const stage=document.getElementById('cardStage');
    stage.innerHTML=`<h2>${card.name}</h2>
    <p><strong>Angel:</strong> ${card.angel||''}</p>
    <p><strong>Demon:</strong> ${card.demon||''}</p>
    <p><strong>Ray:</strong> ${card.ray||''}</p>
    <p><strong>Crystal:</strong> ${card.crystal||''}</p>`;
  }

  document.getElementById('filter').addEventListener('change',e=>{
    state.filter=e.target.value;
    renderList();
  });

  document.getElementById('stylePack').addEventListener('change',e=>{
    document.body.className=document.body.className.replace(/theme-\w+/,'').trim();
    document.body.classList.add('theme-'+e.target.value);
  });

  document.getElementById('query').addEventListener('input',renderList);

  document.getElementById('safe').addEventListener('click',()=>{
    document.body.classList.toggle('nd-safe');
  });

  document.getElementById('banish').addEventListener('click',()=>{
    alert('Consecrated.');
  });

  load();
})();
