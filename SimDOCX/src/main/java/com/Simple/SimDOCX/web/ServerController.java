package com.Simple.SimDOCX.web;

import com.Simple.SimDOCX.model.SaveData;
import com.Simple.SimDOCX.model.Server;
import com.Simple.SimDOCX.service.DocsService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ServerController {
    @Autowired
    private DocsService docsService;

    private List<Server> Servers = new ArrayList<>(){{
        add(new Server());
    }};
    private List<ObjectId> openDocs = new ArrayList<>();
    private Map<ObjectId, Server> map = new HashMap<>();

    @GetMapping("/")
    public String welcome() {
        return "Welcome to the Server Controller.";
    }

    @PostMapping("/register")
    public boolean addServer(@RequestBody Server srv) {
        ServerFunc(srv, 1);
        return true;
    }

    @PostMapping("/deregister")
    public boolean removeServer(@RequestBody Server srv) {
        ServerFunc(srv, 2);
        return true;
    }

    @GetMapping("/getDoc")
    public String getDocServer() {
        Server srv = Servers.get(0);
        return srv.getIp() + srv.getPort(); // for now
    }

    @PostMapping("api/saveDoc")
    public boolean saveDoc(@RequestBody SaveData data) {
        return docsService.saveDoc(data.getDocumentID(), data.getBody());
    }


    private synchronized void ServerFunc(Server srv, int opr) {
        if (opr == 1) {
            Servers.add(srv);
        } else if (opr == 2) {
            Servers.removeIf(server -> server.equals(srv));
            map.entrySet().removeIf(entry -> entry.getValue().equals(srv));
        }
    }
}
