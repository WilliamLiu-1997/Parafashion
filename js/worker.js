importScripts('DerivePatchLayout.js')
importScripts('three_worker.js')

self.addEventListener('message', function (e) {
    Module["onRuntimeInitialized"] = function () {
        let success = 3;
        let [face_js, position_js, line] = e.data
        if (line && line.length == 0) {
            self.postMessage([false, 2]);
            return
        }

        let Faces = new Module.vector$vector$size_t$$()
        let Coords = new Module.vector$vector$double$$()
        for (let i = 0; i < position_js.length; i++) {
            let Coords_Vector = new Module.vector$double$()
            Coords_Vector.push_back(position_js[i][0])
            Coords_Vector.push_back(position_js[i][1])
            Coords_Vector.push_back(position_js[i][2])
            Coords.push_back(Coords_Vector)
        }
        for (let i = 0; i < face_js.length; i++) {
            let Faces_Vector = new Module.vector$size_t$()
            Faces_Vector.push_back(face_js[i][0])
            Faces_Vector.push_back(face_js[i][1])
            Faces_Vector.push_back(face_js[i][2])
            Faces.push_back(Faces_Vector)
        }
        let Points = new Module.vector$vector$vector$double$$$()
        let FacesOut = new Module.vector$vector$size_t$$()
        let CoordsOut = new Module.vector$vector$double$$()
        let Partition = new Module.vector$int$()
        let FaceVertUV = new Module.vector$vector$vector$double$$$()

        if (line) {
            for (let i = 0; i < line.length; i++) {
                let Points_c = new Module.vector$vector$double$$()
                for (let j = 0; j < line[i].length; j++) {
                    let Points_p = new Module.vector$double$()
                    Points_p.push_back(line[i][j].x)
                    Points_p.push_back(line[i][j].y)
                    Points_p.push_back(line[i][j].z)
                    Points_c.push_back(Points_p)
                }
                Points.push_back(Points_c)
            }
        }

        try { Module.DerivePatchLayout(Faces, Coords, Faces, Coords, Points, FacesOut, CoordsOut, Partition, FaceVertUV) }
        catch (error) {
            if (line == false) {
                success = 0;
                self.postMessage([false, success]);
            } else {
                success = 1;
                self.postMessage([false, success]);
            }
        }



        if (success > 0) {


            let partitions = []
            for (let i = 0; i < Partition.size(); i++) {
                partitions.push(Partition.get(i))
            }
            let groups_o = []
            for (let i = 0; i < partitions.length; i++) {
                if (groups_o[partitions[i]] == undefined) {
                    groups_o[partitions[i]] = [i]
                } else {
                    groups_o[partitions[i]].push(i)
                }
            }
            let groups = []
            for (let i = 0; i < groups_o.length / 2; i++) {
                groups.push(groups_o[i])
                groups.push(groups_o[i + groups_o.length / 2])
            }

            let faces = []
            let uvs = []
            for (let i = 0; i < groups.length; i++) {
                for (let j = 0; j < groups[i].length; j++) {
                    faces.push([FacesOut.get(groups[i][j]).get(0), FacesOut.get(groups[i][j]).get(1), FacesOut.get(groups[i][j]).get(2)])
                    let x = i % 2 == 0 ? i : i - 1
                    if (i % 2 == 0) { uvs.push(FaceVertUV.get(groups[x][j]).get(0).get(0), FaceVertUV.get(groups[x][j]).get(0).get(1), FaceVertUV.get(groups[x][j]).get(1).get(0), FaceVertUV.get(groups[x][j]).get(1).get(1), FaceVertUV.get(groups[x][j]).get(2).get(0), FaceVertUV.get(groups[x][j]).get(2).get(1)) }
                    else { uvs.push(-FaceVertUV.get(groups[x][j]).get(1).get(0), FaceVertUV.get(groups[x][j]).get(1).get(1), -FaceVertUV.get(groups[x][j]).get(0).get(0), FaceVertUV.get(groups[x][j]).get(0).get(1), -FaceVertUV.get(groups[x][j]).get(2).get(0), FaceVertUV.get(groups[x][j]).get(2).get(1)) }
                }
            }

            let pos = new Float32Array(faces.length * 9);
            for (let i = 0; i < faces.length * 9; i += 9) {
                pos[i] = CoordsOut.get(faces[i / 9][0]).get(0)
                pos[i + 1] = CoordsOut.get(faces[i / 9][0]).get(1)
                pos[i + 2] = CoordsOut.get(faces[i / 9][0]).get(2)

                pos[i + 3] = CoordsOut.get(faces[i / 9][1]).get(0)
                pos[i + 4] = CoordsOut.get(faces[i / 9][1]).get(1)
                pos[i + 5] = CoordsOut.get(faces[i / 9][1]).get(2)

                pos[i + 6] = CoordsOut.get(faces[i / 9][2]).get(0)
                pos[i + 7] = CoordsOut.get(faces[i / 9][2]).get(1)
                pos[i + 8] = CoordsOut.get(faces[i / 9][2]).get(2)
            }
            let uv = new Float32Array(uvs);
            let geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
            geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
            let index = 0;
            for (let i = 0; i < groups.length; i++) {
                geo.addGroup(index, groups[i].length * 3, i);
                index += groups[i].length * 3
            }
            self.postMessage([geo, success]);

        }
    }
}, false);
