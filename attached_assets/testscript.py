def CalculateTotal(orders):

sum = 0

for i in orders:
 sum += i["value"]
 return sum