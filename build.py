
template = "X = '%s';for (Y = 2; Y;) X = X.replace(RegExp(String.fromCharCode(Y), 'g'), '%s'.split('*')[--Y]);console.log(X)"
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
for n in range(2):
    n = n + 1
    if n in [1,2]:
        data = data.replace(symbols[n-1], chr(n))
    elif n in [13, 10, 9]:
        symbols.append('')
    else:
        sequence = find_best(data)
        data = data.replace(sequence, chr(n))
        symbols.append(sequence)

symbols.reverse()
print symbols

code = template % (data.replace("'","\\'"), "*".join(symbols).replace("'","\\'"))
f = open('try.js','w')
f.write(code)
f.close()
