from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1600, 900
BG     = (11, 25, 41)
CARD   = (15, 34, 54)
CORAL  = (232, 84, 28)
WHITE  = (255, 255, 255)
GREY   = (122, 143, 168)
MUTED  = (30, 58, 85)

img = Image.new("RGB", (W, H), BG)
d   = ImageDraw.Draw(img)

def font(size, bold=False):
    paths = [
        f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if bold else ''}.ttf",
        f"/usr/share/fonts/truetype/liberation/LiberationSans{'-Bold' if bold else ''}.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

# ── top bar ──
d.rectangle([(0, 0), (W, 6)], fill=CORAL)

# ── section label ──
d.text((60, 32), "SECTION 04", font=font(18, bold=True), fill=CORAL)

# ── headline ──
d.text((60, 66), "ADS DRIVE VOLUME,", font=font(52, bold=True), fill=WHITE)
d.text((60, 126), "NOT SPEND SIZE.", font=font(52, bold=True), fill=WHITE)

# ── divider line ──
d.rectangle([(60, 200), (W - 60, 203)], fill=MUTED)

# ── card helper ──
def card(x, y, w, h, r=18):
    d.rounded_rectangle([(x, y), (x+w, y+h)], radius=r, fill=CARD)

# ── LEFT card — ad-exposed ──
CX, CY, CW, CH = 80, 230, 650, 360
card(CX, CY, CW, CH)
d.text((CX + CW//2, CY + 44), "AD-EXPOSED", font=font(20, bold=True), fill=GREY, anchor="mm")
d.text((CX + CW//2, CY + 148), "$28.67", font=font(88, bold=True), fill=WHITE, anchor="mm")
d.text((CX + CW//2, CY + 218), "AVERAGE TRANSACTION VALUE", font=font(16), fill=GREY, anchor="mm")
d.text((CX + CW//2, CY + 260), "AUGUST 2026", font=font(15, bold=True), fill=CORAL, anchor="mm")

# ── RIGHT card — holdout ──
RX = W - 80 - CW
card(RX, CY, CW, CH)
d.text((RX + CW//2, CY + 44), "HOLDOUT GROUP", font=font(20, bold=True), fill=GREY, anchor="mm")
d.text((RX + CW//2, CY + 148), "$29.93", font=font(88, bold=True), fill=WHITE, anchor="mm")
d.text((RX + CW//2, CY + 218), "AVERAGE TRANSACTION VALUE", font=font(16), fill=GREY, anchor="mm")
d.text((RX + CW//2, CY + 260), "AUGUST 2026", font=font(15, bold=True), fill=CORAL, anchor="mm")

# ── VS badge ──
mid = W // 2
d.ellipse([(mid - 42, CY + 130), (mid + 42, CY + 220)], fill=BG, outline=CORAL, width=3)
d.text((mid, CY + 175), "VS", font=font(28, bold=True), fill=CORAL, anchor="mm")

# ── difference callout ──
diff_y = CY + CH + 30
d.text((W//2, diff_y), "DIFFERENCE: $1.26  ·  4.2%", font=font(22, bold=True), fill=GREY, anchor="mm")
d.text((W//2, diff_y + 44), "Ads drive the decision to return — not basket size.", font=font(20), fill=WHITE, anchor="mm")

# ── bottom note ──
d.text((60, H - 38), "ATV measured via Meta holdout methodology. Source: Meta Ads Manager & Redcat.",
       font=font(14), fill=(58, 90, 112))

# ── gms logo ──
d.text((W - 60, 32), "gms", font=font(22, bold=True), fill=CORAL, anchor="ra")

out = "/home/user/dashbaord/atv_graphic.png"
img.save(out, "PNG")
print(f"saved → {out}")
