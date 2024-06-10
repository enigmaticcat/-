// FIFO
function pageFaultsFIFO(pages, n, capacity) {
  console.log('We are in FIFO');
  let s = new Set();
  var indexes = [];
  let r = capacity + 3,
    c = pages.length + 2,
    val = ' ';
  let arr = new Array(r);
  for (let i = 0; i < r; i++) {
    arr[i] = Array(c).fill(val);
  }
  arr[0][0] = 'Page';
  arr[1][0] = 'Reference String';
  for (let i = 2; i < r - 1; i++) arr[i][0] = 'Frame';
  arr[r - 1][0] = 'Hit/Miss';
  for (let j = 0; j <= pages.length; j++) arr[0][j + 1] = j;
  let page_faults = 0;
  for (let i = 0; i < n; i++) {
    arr[1][2 + i] = pages[i];
    let prev_page_faults = page_faults;
    if (s.size < capacity) {
      if (!s.has(pages[i])) {
        s.add(pages[i]);
        page_faults++;
        indexes.push(pages[i]);
      }
    } else {
      if (!s.has(pages[i])) {
        let val = indexes[0];
        indexes.shift();
        s.delete(val);
        s.add(pages[i]);
        indexes.push(pages[i]);
        page_faults++;
      }
    }
    if (prev_page_faults === page_faults) {
      arr[r - 1][i + 2] = '✓';
    } else {
      arr[r - 1][i + 2] = '✗';
    }
    let k = indexes.length - 1,
      ind = 0;
    while (k >= 0) {
      arr[2 + ind][2 + i] = indexes[k];
      ind++;
      k--;
    }
  }
  buildTable(arr);
  return page_faults;
}

// LFU
function pageFaultsLFU(pages, n, capacity) {
  console.log('We are in LFU');
  let s = new Set();
  let frequency = new Map();
  let page_faults = 0;
  let r = capacity + 3,
    c = pages.length + 2,
    val = ' ';
  let arr = new Array(r);
  for (let i = 0; i < r; i++) {
    arr[i] = Array(c).fill(val);
  }
  arr[0][0] = 't';
  arr[1][0] = 'ref';
  for (let i = 2; i < r - 1; i++) arr[i][0] = 'f';
  arr[r - 1][0] = 'hit';
  for (let j = 0; j <= pages.length; j++) arr[0][j + 1] = j;
  
  for (let i = 0; i < n; i++) {
    arr[1][2 + i] = pages[i];
    let prev_page_faults = page_faults;
    
    if (!s.has(pages[i])) {
      if (s.size >= capacity) {
        let leastFreq = Number.MAX_VALUE;
        let leastFreqPage;
        
        for (let page of s) {
          if (frequency.get(page) < leastFreq) {
            leastFreq = frequency.get(page);
            leastFreqPage = page;
          }
        }
        
        s.delete(leastFreqPage);
        frequency.delete(leastFreqPage);
      }
      
      s.add(pages[i]);
      page_faults++;
    }
    
    frequency.set(pages[i], (frequency.get(pages[i]) || 0) + 1);
    
    if (prev_page_faults === page_faults) {
      arr[r - 1][i + 2] = '✓';
    } else {
      arr[r - 1][i + 2] = '✗';
    }
    
    let ind = 0;
    for (let page of s) {
      arr[2 + ind][2 + i] = page;
      ind++;
    }
  }
  
  buildTable(arr);
  return page_faults;
}


// LRU
function pageFaultsLRU(pages, n, capacity) {
  console.log('We are in LRU');
  let s = new Set();
  let indexes = new Map();
  let page_faults = 0;
  let r = capacity + 3,
    c = pages.length + 2,
    val = ' ';
  let arr2 = new Array(r);
  for (let i = 0; i < r; i++) {
    arr2[i] = Array(c).fill(val);
  }
  arr2[0][0] = 't';
  arr2[1][0] = 'ref';
  for (let i = 2; i < r - 1; i++) arr2[i][0] = 'f';
  arr2[r - 1][0] = 'hit';
  for (let j = 0; j <= pages.length; j++) arr2[0][j + 1] = j;
  for (let i = 0; i < n; i++) {
    let prev_page_faults = page_faults;
    arr2[1][2 + i] = pages[i];
    if (s.size < capacity) {
      if (!s.has(pages[i])) {
        s.add(pages[i]);
        page_faults++;
      }
      indexes.set(pages[i], i);
    } else {
      if (!s.has(pages[i])) {
        let lru = Number.MAX_VALUE,
          val = Number.MIN_VALUE;
        for (let itr of s.values()) {
          let temp = itr;
          if (indexes.get(temp) < lru) {
            lru = indexes.get(temp);
            val = temp;
          }
        }
        s.delete(val);
        indexes.delete(val);
        s.add(pages[i]);
        page_faults++;
      }
      indexes.set(pages[i], i);
    }
    if (prev_page_faults === page_faults) {
      arr2[r - 1][i + 2] = '✓';
    } else {
      arr2[r - 1][i + 2] = '✗';
    }
    let k = indexes.size - 1,
      ind = 0;
    for (let itr of indexes) {
      arr2[2 + ind][2 + i] = itr[0];
      ind++;
    }
  }
  buildTable(arr2);
  return page_faults;
}

// NRU (Not Recently Used)
function pageFaultsNRU(pages, n, capacity) {
  console.log('We are in NRU');
  let s = new Set();
  let page_faults = 0;
  let r = capacity + 3,
    c = pages.length + 2,
    val = ' ';
  let arr = new Array(r);
  for (let i = 0; i < r; i++) {
    arr[i] = Array(c).fill(val);
  }
  arr[0][0] = 't';
  arr[1][0] = 'ref';
  for (let i = 2; i < r - 1; i++) arr[i][0] = 'f';
  arr[r - 1][0] = 'hit';
  for (let j = 0; j <= pages.length; j++) arr[0][j + 1] = j;
  let referenceBits = new Map();
  for (let i = 0; i < n; i++) {
    arr[1][2 + i] = pages[i];
    let prev_page_faults = page_faults;
    if (s.size < capacity) {
      if (!s.has(pages[i])) {
        s.add(pages[i]);
        page_faults++;
      }
      referenceBits.set(pages[i], 1);
    } else {
      if (!s.has(pages[i])) {
        let notUsedRecently = Array.from(s).filter((x) => referenceBits.get(x) === 0);
        if (notUsedRecently.length === 0) {
          s.forEach((x) => referenceBits.set(x, 0));
          notUsedRecently = Array.from(s).filter((x) => referenceBits.get(x) === 0);
        }
        let val = notUsedRecently[0];
        s.delete(val);
        referenceBits.delete(val);
        s.add(pages[i]);
        page_faults++;
      }
      referenceBits.set(pages[i], 1);
    }
    if (prev_page_faults === page_faults) {
      arr[r - 1][i + 2] = '✓';
    } else {
      arr[r - 1][i + 2] = '✗';
    }
    let k = Array.from(s).length - 1,
      ind = 0;
    for (let page of s) {
      arr[2 + ind][2 + i] = page;
      ind++;
    }
  }
  buildTable(arr);
  return page_faults;
}

function pageFaultsTLB(pages, n, capacity) {
  console.log('WE are in TLB');
  let tlb = new Set(); 
  let memory = new Set(); 
  let tlb_capacity = Math.ceil(capacity / 2); 
  let indexes = [];
  let page_faults = 0;

  let r = capacity + 3,
      c = pages.length + 2,
      val = ' ';
  let arr5 = new Array(r);
  for (let i = 0; i < r; i++) {
    arr5[i] = Array(c).fill(val);
  }
  arr5[0][0] = 't';
  arr5[1][0] = 'ref';
  for (let i = 2; i < r - 1; i++) arr5[i][0] = 'f';
  arr5[r - 1][0] = 'hit';
  for (let j = 0; j <= pages.length; j++) arr5[0][j + 1] = j;

  for (let i = 0; i < n; i++) {
    arr5[1][2 + i] = pages[i];
    let prev_page_faults = page_faults;

    if (tlb.has(pages[i])) {
      arr5[r - 1][i + 2] = '✓'; 
    } else {
      if (memory.size < capacity) {
        if (!memory.has(pages[i])) {
          memory.add(pages[i]);
          page_faults++;
          indexes.push(pages[i]);
        }
      } else {
        if (!memory.has(pages[i])) {
          let val = indexes[0];
          indexes.shift();
          memory.delete(val);
          memory.add(pages[i]);
          indexes.push(pages[i]);
          page_faults++;
        }
      }

      if (tlb.size >= tlb_capacity) {
        tlb.delete(indexes[0]); 
      }
      tlb.add(pages[i]);

      if (prev_page_faults === page_faults) {
        arr5[r - 1][i + 2] = '✓';
      } else {
        arr5[r - 1][i + 2] = '✗';
      }
    }

    let k = indexes.length - 1,
        ind = 0;
    while (k >= 0) {
      arr5[2 + ind][2 + i] = indexes[k];
      ind++;
      k--;
    }
  }
  console.log(arr5);
  buildTable(arr5);
  return page_faults;
}

// Optimal (OPT)
function pageFaultsOPT(pages, n, capacity) {
  console.log('We are in OPT');
  let s = new Set();
  let page_faults = 0;
  let r = capacity + 3,
    c = pages.length + 2,
    val = ' ';
  let arr = new Array(r);
  for (let i = 0; i < r; i++) {
    arr[i] = Array(c).fill(val);
  }
  arr[0][0] = 't';
  arr[1][0] = 'ref';
  for (let i = 2; i < r - 1; i++) arr[i][0] = 'f';
  arr[r - 1][0] = 'hit';
  for (let j = 0; j <= pages.length; j++) arr[0][j + 1] = j;
  for (let i = 0; i < n; i++) {
    arr[1][2 + i] = pages[i];
    let prev_page_faults = page_faults;
    if (s.size < capacity) {
      if (!s.has(pages[i])) {
        s.add(pages[i]);
        page_faults++;
      }
    } else {
      if (!s.has(pages[i])) {
        let farthest = Number.MIN_VALUE,
          val = null;
        for (let itr of s.values()) {
          let temp = itr;
          let nextUse = pages.slice(i + 1).indexOf(temp);
          if (nextUse === -1) nextUse = Number.MAX_VALUE;
          if (nextUse > farthest) {
            farthest = nextUse;
            val = temp;
          }
        }
        s.delete(val);
        s.add(pages[i]);
        page_faults++;
      }
    }
    if (prev_page_faults === page_faults) {
      arr[r - 1][i + 2] = '✓';
    } else {
      arr[r - 1][i + 2] = '✗';
    }
    let k = Array.from(s).length - 1,
      ind = 0;
    for (let page of s) {
      arr[2 + ind][2 + i] = page;
      ind++;
    }
  }
  buildTable(arr);
  return page_faults;
}

function pushData() {
  let summaryCheck = document.querySelector('#Summary').checked;
  if (!summaryCheck) {
    const part1 = document.querySelector('.part1');
    part1.innerHTML = '';
  }
  let pra = document.querySelector('#pra').value;
  pra = pra.toString();

  pages = [];
  let inputText = document.getElementById('references').value;
  let frames = Number(document.querySelector('.noofframes').value);
  inputText = inputText.split(' ');
  for (let i = 0; i < inputText.length; i++) {
    inputText[i] = Number(inputText[i]);
    pages.push(Number(inputText[i]));
  }

  let faults = 0;
  if (pra === 'LRU') {
    faults = pageFaultsLRU(pages, pages.length, frames);
  } else if (pra === 'FIFO') {
    faults = pageFaultsFIFO(pages, pages.length, frames);
  } else if (pra === 'LFU') {
    faults = pageFaultsLFU(pages, pages.length, frames);
  } else if (pra === 'NRU') {
    faults = pageFaultsNRU(pages, pages.length, frames);
  } else if (pra === 'OPT') {
    faults = pageFaultsOPT(pages, pages.length, frames);
  } else if (pra === 'TLB') {
    faults = pageFaultsTLB(pages, pages.length, frames);
  } else {
    const part2 = document.querySelector('.part2');
    document.querySelector('.part1').innerHTML = '';
    document.querySelector('.part3').innerHTML = '';
    part2.innerHTML = '';
    part2.innerHTML = `<h1 class='opt'><b>Feature Not Available Yet</b></h1>`;
    return;
  }

  buildSchedule(frames, pra, pages, faults, summaryCheck);
}

function buildSchedule(frames, str, pages, faults, summaryCheck) {
  if (summaryCheck) {
    const part1 = document.querySelector('.part1');
    part1.innerHTML = '';
    const head = document.createElement('div');
    head.id = 'head';
    head.innerHTML = `<h2>Summary - ${str} Algorithm</h2>`;
    part1.appendChild(head);
    const base = document.createElement('div');
    base.id = 'base';
    base.innerHTML = `
    <ul>
        <li>Total frames: ${frames}</li>
        <li>Algorithm: ${str}</li>
        <li>Reference string length: ${pages.length} references</li>
        <li>String: ${pages}</li>
      </ul>`;
    part1.appendChild(base);
  }
  const count = {};
  pages.forEach((element) => {
    count[element] = (count[element] || 0) + 1;
  });
  const distinctPages = Object.keys(count).length;
  const part3 = document.querySelector('.part3');
  part3.innerHTML = '';
  const calcs = document.createElement('div');
  calcs.innerHTML = `<ul><li>Total references: ${pages.length}</li>
        <li>Total distinct references: ${distinctPages}</li>
        <li>Hits: ${pages.length - faults}</li>
        <li>Faults: ${faults}</li>
        <li><b>Hit rate:</b> ${pages.length - faults}/${pages.length} = <b>${(
    (1 - faults / pages.length) *
    100
  ).toFixed(2)}</b>%</li>
        <li><b>Fault rate:</b> ${faults}/${pages.length} = <b>${(
    (faults / pages.length) *
    100
  ).toFixed(2)}</b>%</li></ul>`;
  part3.appendChild(calcs);
}

function buildTable(arr) {
  const part2 = document.querySelector('.part2');
  part2.innerHTML = '';
  var mytable = '<table>';
  let i = 0,
    j = 0;
  for (var CELL of arr) {
    mytable += `<tr class="r${i}">`;
    for (var CELLi of CELL) {
      if (CELLi === '✗' || CELLi == '✓') {
        mytable += `<td class="c${j} ${CELLi}">` + CELLi + '</td>';
      } else {
        mytable += `<td class="c${j} ">` + CELLi + '</td>';
      }
      j++;
    }
    j = 0;
    mytable += '</tr>';
    i++;
  }
  mytable += '</table>';
  part2.innerHTML = mytable;
}
