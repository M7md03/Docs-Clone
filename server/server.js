const AsyncLock = require("async-lock");
const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:5173/",
        methods: ["GET", "POST"],
    },
});

let mapDoc = new Map();
let mapRev = new Map();
let mapLock = new Map();
let clientIDs = 0;
const lock = new AsyncLock();

io.on("connection", (socket) => {
    socket.on("get-document", async (documentId) => {
        await lock.acquire(documentId, async () => {
            socket.join(documentId);
            if (mapDoc.has(documentId)) {
                socket.emit(
                    "load-document",
                    mapDoc.get(documentId),
                    mapRev.get(documentId),
                    clientIDs++
                );
            } else {
                mapDoc.set(documentId, []);
                mapRev.set(documentId, 0);
                mapLock.set(documentId, new AsyncLock());
                socket.emit("load-document", "", 0, clientIDs++);
            }
        });

        socket.on("send-changes", async (delta, clientRev, clientID) => {
            await lock.acquire(documentId, async () => {
                let serverRev = mapRev.get(documentId);
                let doc = mapDoc.get(documentId);
                for (let i = clientRev + 1; i < serverRev; i++) {
                    singleTrans(delta.ops, doc[i].ops);
                }
                doc.push(delta);
                mapRev.set(documentId, ++serverRev);

                io.sockets
                    .to(documentId)
                    .emit("receive-changes", delta, clientID);
            });
        });

        socket.on("save-document", async () => {
            await lock.acquire(documentId, async () => {
                if (documentId == null) return;
                fetch("http://localhost:8086/api/saveDoc", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "documentId": documentId,
                        "body": mapDoc.get(documentId)
                    }),
                });
            });
        });
    });
    console.log(`clientID: ${clientIDs}`);
});

function singleTrans(Ops_x, Ops_y) {
    if (!("retain" in Ops_x[0])) {
        Ops_x.unshift({ retain: 0 });
    }
    if (!("retain" in Ops_y[0])) {
        Ops_y.unshift({ retain: 0 });
    }

    if ("insert" in Ops_x[1]) {
        if ("insert" in Ops_y[1]) {
            if (Ops_x[0].retain >= Ops_y[0].retain) {
                Ops_x[0].retain += Ops_y[1].insert.length;
            }
        } else if ("delete" in Ops_y[1]) {
            if (Ops_x[0].retain > Ops_y[0].retain) {
                if (Ops_x[0].retain > Ops_y[0].retain + Ops_y[1].delete) {
                    Ops_x[0].retain -= Ops_y[1].delete;
                } else {
                    Ops_x[0].retain = Ops_y[0].retain;
                }
            }
        } else {
        }
    } else if ("delete" in Ops_x[1]) {
        if ("insert" in Ops_y[1]) {
            if (Ops_x[0].retain >= Ops_y[0].retain) {
                Ops_x[0].retain += Ops_y[1].insert.length;
            }
        } else if ("delete" in Ops_y[1]) {
            if (Ops_x[0].retain < Ops_y[0].retain) {
                if (
                    Ops_x[0].retain + Ops_x[1].delete >
                    Ops_y[0].retain + Ops_y[1].delete
                ) {
                    Ops_x[1].delete -= Ops_y[1].delete;
                } else if (
                    Ops_x[0].retain + Ops_x[1].delete >
                    Ops_y[0].retain
                ) {
                    Ops_x[1].delete = Ops_y[0].retain - Ops_x[0].retain;
                } else {
                }
            } else {
                if (Ops_x[0].retain > Ops_y[0].retain + Ops_y[1].delete) {
                    Ops_x[0].retain -= Ops_y[1].delete;
                } else {
                    Ops_x[1].delete -=
                        Ops_y[0].retain + Ops_y[1].delete - Ops_x[0].retain;
                    if (Ops_x[1].delete < 0) Ops_x[1].delete = 0;
                    Ops_x[0].retain = Ops_y[0].retain;
                }
            }
        } else {
        }
    } else if ("retain" in Ops_x[1]) {
        if ("insert" in Ops_y[1]) {
            if (Ops_x[0].retain > Ops_y[0].retain) {
                Ops_x[0].retain += Ops_y[1].insert.length;
            } else if (Ops_x[0].retain + Ops_x[1].retain > Ops_y[0].retain) {
                Ops_x[1].retain += Ops_y[1].insert.length;
            }
        } else if ("delete" in Ops_y[1]) {
            if (Ops_x[0].retain > Ops_y[0].retain + Ops_y[1].delete) {
                Ops_x[0].retain -= Ops_y[1].delete;
            } else if (Ops_x[0].retain > Ops_y[0].retain) {
                if (
                    Ops_x[0].retain + Ops_x[1].retain <
                    Ops_y[0].retain + Ops_y[1].delete
                ) {
                    Ops_x[1].retain = 0;
                    Ops_x[0].retain = Ops_y[0].retain;
                } else {
                    Ops_x[1].retain =
                        Ops_x[0].retain +
                        Ops_x[1].retain -
                        Ops_y[0].retain -
                        Ops_y[1].delete;
                    Ops_x[0].retain = Ops_y[0].retain;
                }
            } else {
                if (
                    Ops_x[0].retain + Ops_x[1].retain >
                    Ops_y[0].retain + Ops_y[1].delete
                ) {
                    Ops_x[1].retain -= Ops_y[1].delete;
                } else if (
                    Ops_x[0].retain + Ops_x[1].retain >
                    Ops_y[0].retain
                ) {
                    Ops_x[1].retain = Ops_y[0].retain - Ops_x[0].retain;
                }
            }
        } else {
        }
    }

    if (Ops_x[0].retain <= 0) {
        Ops_x.shift();
    }
    if (Ops_y[0].retain <= 0) {
        Ops_y.shift();
    }
}

function printDelta(delta) {}
