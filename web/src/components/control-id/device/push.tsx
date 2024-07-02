"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Push() {
  const [isActive, setActive] = useState(false);
  const [ip, setIP] = useState("");
  const [session, setSession] = useState("");
  useEffect(() => {
    const ip = localStorage.getItem("device_ip");
    if (ip) setIP(ip);
    const session = localStorage.getItem("session");
    if (session) setSession(session);
  }, []);

  async function setPush() {
    try {
      let response;
      if (!isActive) {
        response = await axios.post(
          `http://${ip}/set_configuration.fcgi?session=${session}`,
          {
            push_server: {
              push_request_timeout: "5000",
              push_request_period: "15",
              push_remote_address: "http://192.168.1.53:3000",
            },
          }
        );
        if (response.status === 200) {
          console.log("Ativado ☀");
          setActive(true);
        }
      } else {
        response = await axios.post(
          `http://${ip}/set_configuration.fcgi?session=${session}`,
          {
            push_server: {
              push_remote_address: "",
            },
          }
        );
        if (response.status === 200) {
          console.log("Desativado 🌙");
          setActive(false);
        }
      }
    } catch (error) {
      console.log("Erro ao efetuar push: ", error);
    }
  }

  return (
    <div>
      <Button onClick={() => setPush()}>
        {!isActive ? "Ativar push" : "Desativar push"}
      </Button>
    </div>
  );
}
