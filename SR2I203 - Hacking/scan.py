import sys
import nmap
import nvdlib

#network = sys.argv[1]
network = '10.188.167.0/24'

nm = nmap.PortScanner(nmap_search_path=('nmap',r"D:\Nmap\nmap.exe"))
res_scan = nm.scan(hosts=network, arguments="-sn -PE -n")

active_ip = []
for i in res_scan["scan"]:
    ip = res_scan["scan"][i]["addresses"]["ipv4"]
    active_ip.append(ip)



for ip in active_ip :
    res_scan = nm.scan(hosts=ip, ports="1-200", arguments=" -A -O")
    print(ip," : UP")
    try:
        os = res_scan["scan"][ip]["osmatch"][0]["name"]
        os_cpe = res_scan["scan"][ip]["osmatch"][0]["osclass"][0]["cpe"]
        print("OS : ",os, ", cpe : ",os_cpe)
        r = []
        cves_os = nvdlib.searchCVE(keywordSearch=os)
        for cve in cves_os:
            r.append(cve.id+" "+cve.score[2])
        print("CVE OS : ",r)
    except IndexError:
        print("OS not detected")
    if "tcp" not in res_scan["scan"][ip]:
        print("port not detected")
    else:
        for i in res_scan["scan"][ip]["tcp"]:
            product = res_scan["scan"][ip]["tcp"][i]["product"]
            version = res_scan["scan"][ip]["tcp"][i]["version"]
            cpe = res_scan["scan"][ip]["tcp"][i]["cpe"]
            print(i, " : Port UP, Product : ",product," , version : ",version, ", cpe : ",cpe)
            r = []
            cves = nvdlib.searchCVE(keywordSearch=product)
            for cve in cves:
                r.append(cve.id+" "+cve.score[2])
            print("CVE: ",r)
    print("============================================")

print("Fin")
