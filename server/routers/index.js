const router = require("koa-router")();
const multer = require("@koa/multer");
const fs = require("fs");
const path = require("path");
const uploadPath = path.join(__dirname, 'uploads');
const uploadTempPath = path.join(uploadPath, 'temp');
const upload = multer({
    dest: uploadTempPath
});

const mkdirsSync = (dirname) => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

router.get("/test", async (ctx, next) => {
    ctx.body = "koa2 string";
});
//校验是否存在分片
router.post("/api/check", async (ctx, next) => {
    const {
        hash,
    } = ctx.request.body;
    const chunksPath = path.join(uploadPath, hash, '/');
    if (fs.existsSync(chunksPath)) {
        const chunks = fs.readdirSync(chunksPath);
        return (ctx.body = {
            state: 0,
            data: {
                message: chunks,
            },
        });
    } else {
        return (ctx.body = {
            state: 0,
            data: {
                message: [],
            },
        });
    }
});
//上传
router.post("/api/upload", upload.single("file"), async (ctx, next) => {
    console.log("file upload...");
    const {
        name,
        index,
        hash
    } = ctx.request.body;
    console.log(name);
    const chunksPath = path.join(uploadPath, hash, '/');
    if (!fs.existsSync(chunksPath)) mkdirsSync(chunksPath);
    fs.renameSync(ctx.file.path, chunksPath + hash + '-' + index);

    const chunks = fs.readdirSync(chunksPath);
    return (ctx.body = {
        state: 0,
        data: {
            message: chunks,
        },
    });
});
//合并
router.post("/api/merge", async (ctx, next) => {
    const {
        name,
        hash,
        total
    } = ctx.request.body;
    const chunksPath = path.join(uploadPath, hash, '/');
    const filePath = path.join(uploadPath, name);

    const chunks = fs.readdirSync(chunksPath);
    fs.writeFileSync(filePath, '');
    if (chunks.length !== total || chunks.length === 0) {
        ctx.status = 200;
        ctx.res.end('切片文件数量不符合');
        return;
    }
    for (let i = 0; i < total; i++) {
        // 追加写入到文件中
        fs.appendFileSync(filePath, fs.readFileSync(chunksPath + hash + '-' + i));
        // 删除本次使用的chunk    
        fs.unlinkSync(chunksPath + hash + '-' + i);
    }
    fs.rmdirSync(chunksPath);
    return (ctx.body = {
        state: 0,
        data: {
            url: filePath,
        },
    });
});

module.exports = router;