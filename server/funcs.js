// import Quill from "quill";

// export default function createDoc(deltaArr) {
//     const doc = new Quill();
//     for (const delta in deltaArr) {
//         doc.updateContents(delta)
//     }
//     return doc;
// }

// export default function singleTrans(Ops_x, Ops_y) {
//     console.log("singleTrans")
//     if (!("retain" in Ops_x[0])) {
//         Ops_x.unshift({ retain: 0 });
//     }
//     if (!("retain" in Ops_y[0])) {
//         Ops_y.unshift({ retain: 0 });
//     }

//     //opsObject.ops.forEach(operation => {
//     // Check the type of operation and extract details

//     if ("insert" in Ops_x[1]) {
//         console.log("opx is Insert")
//         if ("insert" in Ops_y[1]) {
//             console.log("opy is Insert")
//             if (Ops_x[0].retain > Ops_y[0].retain) {
//                 Ops_x[0].retain += Ops_y[1].insert.length;
//             }
//         } else if ("delete" in Ops_y[1]) {
//             if (Ops_x[0].retain > Ops_y[0].retain) {
//                 if (Ops_x[0].retain > Ops_y[0].retain + Ops_y[1].delete) {
//                     Ops_x[0].retain -= Ops_y[1].delete;
//                 } else {
//                     Ops_x[0].retain = Ops_y[0].retain;
//                 }
//             }
//         } else {
//         }
//     } else if ("delete" in Ops_x[1]) {
//         if ("insert" in Ops_y[1]) {
//             if (Ops_x[0].retain > Ops_y[0].retain) {
//                 Ops_x[0].retain += Ops_y[1].insert.length;
//             }
//         } else if ("delete" in Ops_y[1]) {
//             if (Ops_x[0].retain < Ops_y[0].retain) {
//                 if (
//                     Ops_x[0].retain + Ops_x[1].delete >
//                     Ops_y[0].retain + Ops_y[1].delete
//                 ) {
//                     Ops_x[1].delete -= Ops_y[1].delete;
//                 } else if (
//                     Ops_x[0].retain + Ops_x[1].delete >
//                     Ops_y[0].retain
//                 ) {
//                     Ops_x[1].delete = Ops_y[0].retain - Ops_x[0].retain;
//                 } else {
//                     console.log("Here!");
//                 }
//             } else {
//                 if (Ops_x[0].retain > Ops_y[0].retain + Ops_y[1].delete) {
//                     Ops_x[0].retain -= Ops_y[1].delete;
//                 } else {
//                     Ops_x[1].delete -=
//                         Ops_y[0].retain + Ops_y[1].delete - Ops_x[0].retain;
//                     if (Ops_x[1].delete < 0) Ops_x[1].delete = 0;
//                     Ops_x[0].retain = Ops_y[0].retain;
//                 }
//             }
//         } else {
//         }
//     } else if ("retain" in Ops_x[1]) {
//         if ("insert" in Ops_y[1]) {
//             if (Ops_x[0].retain > Ops_y[0].retain) {
//                 Ops_x[0].retain += Ops_y[1].insert.length;
//             } else if (Ops_x[0].retain + Ops_x[1].retain > Ops_y[0].retain) {
//                 Ops_x[1].retain += Ops_y[1].insert.length;
//             }
//         } else if ("delete" in Ops_y[1]) {
//             if (Ops_x[0].retain > Ops_y[0].retain + Ops_y[1].delete) {
//                 Ops_x[0].retain -= Ops_y[1].delete;
//             } else if (Ops_x[0].retain > Ops_y[0].retain) {
//                 if (
//                     Ops_x[0].retain + Ops_x[1].retain <
//                     Ops_y[0].retain + Ops_y[1].delete
//                 ) {
//                     Ops_x[1].retain = 0;
//                     Ops_x[0].retain = Ops_y[0].retain;
//                 } else {
//                     Ops_x[1].retain =
//                         Ops_x[0].retain +
//                         Ops_x[1].retain -
//                         Ops_y[0].retain -
//                         Ops_y[1].delete;
//                     Ops_x[0].retain = Ops_y[0].retain;
//                 }
//             } else {
//                 if (
//                     Ops_x[0].retain + Ops_x[1].retain >
//                     Ops_y[0].retain + Ops_y[1].delete
//                 ) {
//                     Ops_x[1].retain -= Ops_y[1].delete;
//                 } else if (
//                     Ops_x[0].retain + Ops_x[1].retain >
//                     Ops_y[0].retain
//                 ) {
//                     Ops_x[1].retain = Ops_y[0].retain - Ops_x[0].retain;
//                 }
//             }
//         } else {
//         }
//     }

//     if (Ops_x[0].retain <= 0) {
//         Ops_x.shift();
//     }
//     if (Ops_y[0].retain <= 0) {
//         Ops_y.shift();
//     }
// }