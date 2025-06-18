import threading
import socket
import json
from app import utils 

def bind_chat_server():
  try:
    server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server.settimeout(15)
    server.bind(('', utils.APP_PORT))

    while True:
      conn, addr = server.accept()
      threading.Thread()

  finally:
    server.close()

def make_server_visible():
  try:
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    udp_socket.bind(('', utils.DISCOVERY_PORT))
    while True:
      data, addr = udp_socket.recvfrom(1024)
      if data.decode() == "FLAG_DISCOVER_SERVER":
        response = {
          "server_host": utils.get_local_ip(),
          "port": utils.APP_PORT
        }
        udp_socket.sendto(json.dumps(response).encode(), addr)
      
  except Exception:
    print("Couldn't to make the server visible.")
  finally:
    udp_socket.close()