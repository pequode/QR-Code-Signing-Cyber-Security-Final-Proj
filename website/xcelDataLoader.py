import json
from os import times
import xlwt
from xlwt import Workbook
import matplotlib.pyplot as plt
import numpy as np
# saves data as an exel spreadsheet
wb = Workbook()
sheet1 = wb.add_sheet('Result Data')
style = xlwt.easyxf('font: bold 1, color orange;')
sheet1.write(0, 0, 'Source', style)
sheet1.write(0, 1, 'Time', style)
sheet1.write(0, 2, 'Cookie', style)
sheet1.write(0, 3, 'User', style)
sheet1.write(0, 4, 'IP', style)

# sheet1.write(1, 0, 'test')
# wb.save('xlwt example.xls')
path = "./"
f = open(path + 'website/resultDoc.json', 'r')
data = json.loads(f.read())


length = len(data)

print(length)
list_of_dicts = []
# very specific code to get json data
for i in range(0,length):
    source = data[i]['doc']['data']['value']['mapValue']['fields']['Source']['stringValue']
    # print(type(source))
    timestamp = data[i]['doc']['data']['value']['mapValue']['fields']['Time']['stringValue']
    userInfo = data[i]['doc']['data']['value']['mapValue']['fields']['User']['stringValue']
    ip_Info = data[i]['doc']['data']['value']['mapValue']['fields']['IP']['mapValue']['fields']['IP']['stringValue']
    sheet1.write(i+1,0,source)
    sheet1.write(i+1,1,timestamp)
    sheet1.write(i+1,2,data[i]['doc']['data']['value']['mapValue']['fields']['Cookies']['stringValue'])
    sheet1.write(i+1,3,userInfo)
    sheet1.write(i+1,4,ip_Info)
    browser = userInfo[:userInfo.find("(")]
    dev = userInfo[userInfo.find("(")+1:userInfo.find(";")]
    devV = userInfo[userInfo.find(";")+2:userInfo.find(")",userInfo.find("(")+1,len(userInfo)-1)]
    # userInfoDic = {
    #     "browser":browser,
    #     "device": dev,
    #     "device_V": devV
    # }
    # print(userInfo)
    dic = {
            'time': timestamp,
            'src' : source,
            'ip' : ip_Info,
            'userInfo': userInfo,
            "browser":browser,
            "device": dev,
            "device_V": devV
    }
    list_of_dicts.append(dic)
wb.save(path+'CyberSecData1.xls')
# same function from readServeyData.py

def HistogramFromDic(field,dics):
    newDic = {}
    for i in dics:
        key = i[field]
        if key in newDic.keys():
            newDic[key] +=1
        else:
            newDic[key] = 1
    # print(newDic)
    labels = list(newDic.keys())
    vals = list(newDic.values())
    # print(labels,vals)
    return labels,vals
#same function but does the formating of the strings
def ipHistogram(listOfIps,ipmatchsection =1 ):
    dic = {}
    for ip in listOfIps:
        revisedIp = ip[:ip.find(".",4*ipmatchsection,len(ip))]
        key = revisedIp+"/"+str(24-8*ipmatchsection)
        if key in dic.keys():
            dic[key] +=1
        else:
            dic[key] = 1
    labels = list(dic.keys())
    vals = list(dic.values())
    return labels,vals
#creates the plot and saves it as an image
def makeHistogram(labels,freqency,name,rotangle = -10):
    plt.title('Histogram of '+name, loc = 'left', fontsize = 18)
    x = range(len(labels))
    plt.bar(x,freqency,tick_label=labels,color = "red")
    plt.xticks(rotation=rotangle)
    # plt.show()
    plt.savefig(path+'Hist{name}.png'.format(name=name))

# run all functions
[vers_lables,versN] = HistogramFromDic("device_V",list_of_dicts)
vers_lables.sort()
print(vers_lables)

[ip_list,nvm] = HistogramFromDic("ip",list_of_dicts)
print(ip_list)
ip_list.sort()
print(ip_list)
# writes IPs to a list for manual sorting to determine provider
f = open(path + "outIP.txt","w")
for i in ip_list:
    f.write(i+"\n")
f.close()
[ip_list,ip_vals] = ipHistogram(ip_list)
[dev_lables,devN] = HistogramFromDic("device",list_of_dicts)
[src_lables,srcN] = HistogramFromDic("src",list_of_dicts)
print(src_lables,srcN)
print(ip_list)
makeHistogram(dev_lables,devN,"Device")
makeHistogram(src_lables,srcN,"Source")
makeHistogram(ip_list,ip_vals,"IP",rotangle=-80)
