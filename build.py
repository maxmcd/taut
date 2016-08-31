import sys
import json 

def window_iter(data, length):
    for i in range(len(data) - length):
        yield data[i:i+length]

def find_best(data):
    symbols = {}
    for size in range(2, 100):
        hit = False
        for window in window_iter(data, size):
            count = data.count(window)
            if count > 1:
                hit = True
                symbols[window] =  count * size
        if not hit: 
            break
        
    return sorted(symbols, key=symbols.__getitem__)[-1]

data = sys.stdin.read().strip()
symbols = ["'", '"']

quantity = 4

for n in range(quantity):
    if n in [0,1]:
        data = data.replace(symbols[n], chr(n+1))
    elif n in [13, 10, 9]:
        symbols.append('')
    else:
        sequence = find_best(data)
        data = data.replace(sequence, chr(n+1))
        symbols.append(sequence)

# symbols.reverse()
print symbols


f = open('try.js','w')
f.write("X = '")
f.write(data)
f.write("';for (Y = " + str(quantity) + "; Y;) X = X.replace(RegExp(String.fromCharCode(Y), 'g'), '")
f.write("*".join(symbols).replace("'","\\'"))
f.write("'.split('*')[--Y]);console.log(JSON.stringify(X))")
f.close()
