import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./TextEditor.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import AsyncLock from "async-lock";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [["bold", "italic"]];

export default function TextEditor() {
    const { id: documentId } = useParams();
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    console.log(documentId);

    let deltaBuff = [];
    let currentRev = 0;
    let myID = null;
    const lock = new AsyncLock();

    useEffect(() => {
        const s = io("http://localhost:3001/", {
            transports: ["websocket"], // Required when using Vite
        });
        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket == null || quill == null) return;

        socket.once("load-document", (document, serverRev, clientID) => {
            for (const d of document) {
                quill.updateContents(d);
                console.log(d.ops);
            }
            currentRev = serverRev;
            myID = clientID;
            quill.enable();
        });

        socket.emit("get-document", documentId);
    }, [socket, quill, documentId]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const interval = setInterval(() => {
            socket.emit("save-document");
        });

        return () => {
            clearInterval(interval);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = async (delta, clientID) => {
            await lock.acquire(documentId, async () => {
                if (clientID == myID) {
                    if (deltaBuff.length != 0) {
                        deltaBuff.shift();
                        currentRev++;
                        if (deltaBuff.length != 0) {
                            socket.emit(
                                "send-changes",
                                deltaBuff[0][0],
                                deltaBuff[0][1],
                                myID
                            );
                        }
                    } else {
                        console.log(
                            "Error! recived my change but deltaBuff is empty."
                        );
                    }
                } else {
                    for (let i = 0; i < deltaBuff.length; i++) {
                        singleTrans(delta.ops, deltaBuff[i][0].ops);
                    }
                    quill.updateContents(delta);
                    currentRev++;
                }
            });
        };
        socket.on("receive-changes", handler);

        return () => {
            socket.off("receive-change", handler);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = async (delta, oldDelta, source) => {
            await lock.acquire(documentId, async () => {
                if (source !== "user") return;
                deltaBuff.push([delta, currentRev]);
                if (deltaBuff.length == 1) {
                    socket.emit(
                        "send-changes",
                        deltaBuff[0][0],
                        deltaBuff[0][1],
                        myID
                    );
                }
            });
        };

        quill.on("text-change", handler);

        return () => {
            quill.off("text-change", handler);
        };
    }, [socket, quill]);

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);

        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS },
        });
        q.disable();
        q.setText("Loading...");
        setQuill(q);
    }, []);

    return (
        <div
            id="text-editor"
            ref={wrapperRef}
            className="bg-gradient-to-b from-blue-500 to-purple-500 rounded-[20px]"
        >
            TextEditor
        </div>
    );
}

function singleTrans(Ops_x, Ops_y) {
  if (!("retain" in Ops_x[0])) {
      Ops_x.unshift({ retain: 0 });
  }
  if (!("retain" in Ops_y[0])) {
      Ops_y.unshift({ retain: 0 });
  }

  //opsObject.ops.forEach(operation => {
  // Check the type of operation and extract details

  if ("insert" in Ops_x[1]) {
      if ("insert" in Ops_y[1]) {
          if (Ops_x[0].retain > Ops_y[0].retain) {
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
                  console.log("Here!");
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
