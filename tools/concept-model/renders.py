import asyncio, os, sys
from playwright.async_api import async_playwright
OUT = "public/images/concept"  # run from the repo root while `next start -p 3100` is running
VIEWS = ["hero","overview","hospital","heritage","commercial","housing","golf","hotel","university","arena","forest","wetland","dairy","agro","bamboo","ecolodge","utilities"]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
        pg = await b.new_page(viewport={"width":1600,"height":1000}, device_scale_factor=1, color_scheme="light")
        logs=[]
        pg.on("pageerror", lambda e: logs.append(str(e)))
        pg.on("console", lambda m: logs.append(m.text) if m.type=="error" else None)
        await pg.goto("http://127.0.0.1:3100/explore")
        await pg.wait_for_function("window.__ymf !== undefined", timeout=180000)
        await pg.add_style_tag(content="header, section[aria-live], aside, [role=group], .absolute.bottom-4, .absolute.left-4 {display:none !important}")
        await pg.wait_for_timeout(1500)
        canvas = pg.locator("canvas")
        for v in VIEWS:
            await pg.evaluate(f"window.__ymf.shot('{v}')")
            await pg.wait_for_timeout(1200)
            bb = await canvas.bounding_box()
            await pg.screenshot(path=f"{OUT}/{v}.png", clip=bb, timeout=120000)
            print("shot", v, flush=True)
        print("errors:", logs[:5])
        await b.close()
asyncio.run(main())
