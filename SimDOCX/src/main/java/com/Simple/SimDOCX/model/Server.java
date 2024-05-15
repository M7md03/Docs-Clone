package com.Simple.SimDOCX.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Server {
    private String ip;
    private int port;

    @Override
    public boolean equals(Object y) {
        if (y == this) return true;
        if (y == null) return false;
        if (y.getClass() != this.getClass()) return false;

        Server yServer = (Server) y;
        if (!this.ip.equals(yServer.ip)) return false;
        if (this.port != yServer.port) return false;
        return true;
    }
}
