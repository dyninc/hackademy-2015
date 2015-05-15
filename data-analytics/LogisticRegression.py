
# coding: utf-8

# ## Logistic Regression
# 
# A student has answered $15 - 8 = $ eleven times over the course of the year.  We have tracked for each attempt whether the student was correct along with a measure of their mathematical proficiency.
# 
# If a second student is practicing subtraction, can we determine if this question is the appropriate difficulty for them given that we have an estimate of the student's mathematical proficiency?
# 

# In[21]:

import math
import matplotlib
import matplotlib.pyplot as plt
get_ipython().magic('matplotlib inline')
plt.rcParams['figure.figsize'] = (12, 6)
font = {'size': 20}
matplotlib.rc('font', **font)


# ### The recorded data
# 
# The eleven data points are shown below in the form (x, y) where
# 
# ```
# x = the estimate proficiency of the student at the time the question was answered (range 2-13)
# y = if the question was answered correctly (0 = incorrect, 1 = correct)
# ```

# In[23]:

data = [
    (2,0),(3,0),(4,0),(6,0),(6,1),(7,0),(8,0),(8,1),(10,1),(11,1),(13,1)
]
xmin = 2
xmax = 13


# ### The Logistic Function
# 
# $$ F(x) = \frac{1}{1+e^{-x}}$$

# In[24]:

def logistic_regression():
    incorrect = [x[0] for x in data if x[1] == 0]
    correct = [x[0] for x in data if x[1] == 1]
    plt.figure()
    ax = plt.axes()
    ax.set_xlabel("proficiency")
    ax.set_ylabel("correct or incorrect")
    ax.set_ylim((-0.2, 1.2))
    ax.plot(incorrect, [0 for x in incorrect], 'o', c='b', ms=12)
    ax.plot(correct, [1 for x in correct], 'o', c='g', ms=12)
    ax.grid()
    
    x = [v/1000.0 * (xmax-xmin) + xmin for v in range(1000)]
    y = [logistic(v) for v in x]
    ax.plot(x, y, '-', alpha=0.7, c='r', lw=4)
    

def logistic(x):
    return 1 / (1 + math.exp(-(b0+b1*x)))


# For this example we'll stick with the linear expression in the exponent, but allow for adjustment of the slope and intercept terms.
# 
# $$F(x) = \frac{1}{1+e^{-(\beta_0+\beta_1x)}}$$

# In[35]:

b0 = -14; b1 = 2
logistic_regression()


# In[ ]:



