// Run against a local server with Playwright installed; see README.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
  try {
    for (const viewport of [{width:1000,height:800},{width:390,height:844}]) {
      const context = await browser.newContext({viewport,hasTouch:viewport.width<500});
      const page = await context.newPage(), errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(process.env.GAME_URL || 'http://127.0.0.1:8765');
      await page.waitForFunction(()=>document.querySelector('#lead').textContent.includes('Cindra'));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      // Old saves have no new flags. Keep the original save and controls keys.
      await page.evaluate(()=>{
        localStorage.setItem(key,JSON.stringify({x:14,y:8,party:[make('Cindra',5)],storage:[],cores:7,seen:['Cindra'],caught:['Cindra'],wins:0}));
        localStorage.setItem(controlKey,JSON.stringify({...defaultControls,up:'i',padSize:64,showPad:true}));
      });
      await page.reload();
      assert.equal(await page.evaluate(()=>game.rootcallOpened),false);
      assert.equal(await page.evaluate(()=>controlSettings.up),'i');
      assert.equal(await page.evaluate(()=>controlSettings.padSize),64);
      assert.equal(await page.evaluate(()=>pathTo(16,8)),null);
      assert.equal(await page.locator('#rootcall').isDisabled(),true);
      await page.evaluate(()=>step(1,0));
      assert.deepEqual(await page.evaluate(()=>[game.x,game.y]),[14,8]);
      // Capture through the actual capture action, then select the new lead through UI.
      await page.evaluate(()=>{
        startBattle(); wild=make('Thornback',4); wild.hp=1; updateBattle();
        const savedRandom=Math.random; Math.random=()=>0; capture(); Math.random=savedRandom;
      });
      await page.getByRole('button',{name:'🎒 Party',exact:true}).click();
      await page.getByRole('button',{name:'Make leader'}).click();
      await page.locator('#menu').getByRole('button',{name:'✕ Close'}).click();
      assert.equal(await page.evaluate(()=>game.party[0].name),'Thornback');
      assert.equal(await page.locator('#rootcall').isEnabled(),true);
      // Follower occupies the previous player tile and manual movement respects the gate.
      await page.evaluate(()=>step(-1,0));
      assert.deepEqual(await page.evaluate(()=>follower),{x:14,y:8});
      assert.equal(await page.locator('#rootcall').isDisabled(),true);
      await page.evaluate(()=>step(1,0));
      // Field actions cannot run through menus or during battles.
      await page.getByRole('button',{name:'⚙️ Controls',exact:true}).click();
      assert.equal(await page.locator('#rootcall').isDisabled(),true);
      await page.getByRole('button',{name:'✅ Done'}).click();
      await page.evaluate(()=>{battle=true;useRootcall();battle=false});
      assert.equal(await page.evaluate(()=>game.rootcallOpened),false);
      await page.locator('#rootcall').click();
      assert.equal(await page.evaluate(()=>game.rootcallOpened),true);
      assert.equal(await page.evaluate(()=>pathTo(17,8).length),3);
      // Tap the glade in scaled canvas coordinates and let pathfinding finish.
      const box=await page.locator('#world').boundingBox();
      const tap=[box.x+box.width*17.5/20,box.y+box.height*8.5/12];
      if(viewport.width<500)await page.touchscreen.tap(...tap);
      else await page.mouse.click(...tap);
      await page.waitForFunction(()=>game.x===17&&game.y===8);
      assert.equal(await page.evaluate(()=>game.rootcallVisited),true);
      assert.equal(await page.evaluate(()=>game.cores),9); // 7 - capture + 3 reward.
      await page.evaluate(()=>{step(-1,0);step(1,0)});
      assert.equal(await page.evaluate(()=>game.cores),9);
      await page.reload();
      assert.equal(await page.evaluate(()=>game.rootcallOpened&&game.rootcallVisited),true);
      assert.equal(await page.evaluate(()=>tiles[8][15]),'path');
      assert.equal(await page.evaluate(()=>game.party[0].name),'Thornback');
      assert.equal(await page.evaluate(()=>game.cores),9);
      // Fainting/teleportation resets the follower near the player.
      await page.evaluate(()=>{game.x=3;game.y=8;updateHud()});
      assert.equal(await page.evaluate(()=>Math.abs(follower.x-game.x)+Math.abs(follower.y-game.y)),1);
      assert.deepEqual(errors,[]);
      console.log('PASS '+viewport.width+'px: legacy save, controls, capture, lead, follower, gate, UI, path, reward, reload');
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});

