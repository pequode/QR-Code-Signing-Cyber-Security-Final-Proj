import json
import matplotlib.pyplot as plt
import numpy as np
# this reads the output json from firebase.
# this is a work around because firebase doesnt allow downloads of data without paid subscription
#used if you need an absolute path 
path = "./"
f = open(path+'website/resultServey.json', 'r')
data = json.loads(f.read())
length = len(data)
f.close()
statsData =[]
thoughtsList = []
# very specific breakable code from the given json input
for i in data:
    level = i['doc']['data']['value']['mapValue']['fields']['Level']['stringValue']
    how = i['doc']['data']['value']['mapValue']['fields']['How']['stringValue']
    throughts = i['doc']['data']['value']['mapValue']['fields']['Thoughts']['stringValue']
    if ( level !="\"\"" and how !="\"\""):
        dic = {
            'Lvl': level[1:-1],
            'Vect': how[1:-1],
        }
        statsData.append(dic)
    if throughts != "\"\"":
        # print(throughts)
        str = "{where}|{lev}:".format(where = how[1:-1],lev=level[1:-1])+throughts[1:-1]
        thoughtsList.append(str)
# this prints a list of the different comments people left
print(thoughtsList)
# this creates a freqency histogram from a dictionary
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
# makes a histogram pyplot
def makeHistogram(labels,freqency,name,rotangle = -10):
    plt.title('Histogram of '+name, loc = 'left', fontsize = 18)
    x = range(len(labels))
    plt.bar(x,freqency,tick_label=labels,color = "red")
    plt.xticks(rotation=rotangle)
    # plt.show()
    plt.savefig(path+'Hist{name}.png'.format(name=name))
# creates the outputs
lengStr = len(statsData)
[lev_labels,levN] = HistogramFromDic("Lvl",statsData)
[how_labels,howN] = HistogramFromDic("Vect",statsData)
makeHistogram(lev_labels,levN,"Security Level (total):{size}".format(size=lengStr))
makeHistogram(how_labels,howN,"Self Report Location (total):{size}".format(size=lengStr))
f = open(path + "outputServeyComments.txt","w")
for com in thoughtsList:
    f.write(com+"\n")
f.close()
