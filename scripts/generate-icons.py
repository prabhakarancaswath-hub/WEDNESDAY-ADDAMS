from PIL import Image, ImageDraw
import os

def portrait(size=1024):
    s=size
    im=Image.new("RGBA",(s,s),(9,11,20,255))
    d=ImageDraw.Draw(im)
    def box(v): return tuple(int(x*s/1024) for x in v)
    d.rounded_rectangle(box((28,28,996,996)),radius=int(s*.22),fill=(31,23,43,255),outline=(133,105,169,255),width=max(2,int(s*.012)))
    d.ellipse(box((92,70,932,910)),outline=(132,105,164,180),width=max(2,int(s*.012)))
    # long dark hair silhouette and twin braids
    d.ellipse(box((245,112,779,845)),fill=(8,8,14,255))
    d.rounded_rectangle(box((215,300,340,870)),radius=int(s*.07),fill=(10,9,15,255))
    d.rounded_rectangle(box((684,300,809,870)),radius=int(s*.07),fill=(10,9,15,255))
    # face
    d.ellipse(box((326,180,698,700)),fill=(226,211,201,255),outline=(171,148,143,255),width=max(2,int(s*.008)))
    # hair fringe
    d.polygon([tuple(int(v*s/1024) for v in p) for p in [(310,350),(280,205),(360,120),(512,95),(664,120),(744,205),(714,350),(640,282),(575,330),(512,265),(449,330),(384,282)]],fill=(7,7,12,255))
    # brows and eyes
    d.line([box((382,420))[0:2],box((464,414))[0:2]],fill=(29,24,31,255),width=max(3,int(s*.022)))
    d.line([box((560,414))[0:2],box((642,420))[0:2]],fill=(29,24,31,255),width=max(3,int(s*.022)))
    d.ellipse(box((416,430,448,456)),fill=(20,19,25,255))
    d.ellipse(box((576,430,608,456)),fill=(20,19,25,255))
    d.line([box((512,450))[0:2],box((493,535))[0:2],box((521,542))[0:2]],fill=(165,137,132,255),width=max(2,int(s*.009)))
    d.arc(box((474,552,550,600)),start=15,end=165,fill=(105,65,78,255),width=max(2,int(s*.009)))
    # white collar and black uniform
    d.polygon([tuple(int(v*s/1024) for v in p) for p in [(325,655),(512,760),(699,655),(850,1024),(174,1024)]],fill=(13,12,19,255))
    d.polygon([tuple(int(v*s/1024) for v in p) for p in [(390,665),(512,780),(634,665),(590,1024),(434,1024)]],fill=(240,234,238,255))
    d.polygon([tuple(int(v*s/1024) for v in p) for p in [(474,720),(512,780),(550,720),(532,1024),(492,1024)]],fill=(38,31,48,255))
    # braid details
    for x in (274,750):
        for j in range(6):
            y=470+j*62
            d.ellipse(box((x-34,y-25,x+34,y+35)),fill=(12,10,17,255),outline=(66,53,76,255),width=max(2,int(s*.008)))
    return im

os.makedirs("assets",exist_ok=True)
icon=portrait(1024)
icon.save("assets/icon-only.png")
icon.resize((256,256),Image.Resampling.LANCZOS).save("assets/wednesday.ico",format="ICO",sizes=[(256,256),(128,128),(64,64),(32,32),(16,16)])
splash=Image.new("RGB",(2732,2732),(9,11,20))
mark=icon.resize((1250,1250),Image.Resampling.LANCZOS)
splash.paste(mark,((2732-mark.width)//2,(2732-mark.height)//2),mark)
splash.save("assets/splash.png")
print("Wednesday portrait icons generated.")
