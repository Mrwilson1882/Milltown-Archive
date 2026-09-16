# Source clips

Raw phone footage goes here, exactly as shot. Nothing in this folder is
posted; it is the input to `build/polish.mjs`, which speeds a clip up a touch
and bookends it with the wordmark, and to `build/ads.mjs`, which cuts the
adverts.

Why here and not in the chat: the chat upload caps at 30MB and a phone clip
is usually bigger. Git does not care — GitHub takes files to 100MB (it prints
a warning above 50MB, which is only a warning). GitHub's *web* uploader is
capped at 25MB, so a large clip has to come in through `git push` or GitHub
Desktop rather than drag-and-drop on github.com.

    git checkout claude/archive-wholesale-instagram-ads-72rlmi
    git pull
    cp ~/wherever/clip.mp4 marketing/instagram/source/
    git add marketing/instagram/source/clip.mp4
    git commit -m "Source clip: <what it is>"
    git push

If this becomes a habit, `git lfs track "marketing/instagram/source/*.mp4"`
keeps the big files out of the repository's history. For one or two clips it
is not worth the setup.
