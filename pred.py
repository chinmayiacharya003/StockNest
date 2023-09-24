import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import yfinance as yf
import datetime as dt


from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM


#Load data

company='AAPL'
start=dt.datetime(2013,1,1)
end=dt.datetime(2023,1,1)
data = yf.download(company, start=start, end=end)

#Prepare data

scaler=MinMaxScaler (feature_range=(0,1))
scaled_data=scaler.fit_transform(data['Close'].values.reshape(-1,1))

prediction_days=60

x_train=[]
y_train=[]

for x in range(prediction_days, len(scaled_data)):
    x_train.append(scaled_data[x-prediction_days:x,0])
    y_train.append(scaled_data[x,0])
x_train,y_train=np.array(x_train),np.array(y_train)
x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
 

#Build model

model=Sequential()
model.add(LSTM(units=50,return_sequences=True,input_shape=(x_train.shape[1],1)))
model.add(Dropout(0.2))
model.add(LSTM(units=50,return_sequences=True))
model.add(Dropout(0.2))
model.add(LSTM(units=50))
model.add(Dropout(0.2))
model.add(Dense(units=1))

model.compile(optimizer='adam',loss='mean_squared_error')
model.fit(x_train,y_train,epochs=15,batch_size=12)

#Testing model on exsisting data

#Load test data

test_start=dt.datetime(2013,1,1)
test_end=dt.datetime.now()

test_data=yf.download(company,start=test_start,end=test_end)
acutual_prices=test_data['Close'].values

total_dataset=pd.concat((data['Close'],test_data['Close']), axis=0)

model_inputs=total_dataset[len(total_dataset)-len(test_data)-prediction_days:].values
model_inputs=model_inputs.reshape(-1,1)
model_inputs=scaler.transform(model_inputs)

#Make predictions on test data

x_test=[]

for x in range(prediction_days,len(model_inputs)):
    x_test.append(model_inputs[x-prediction_days:x,0])
x_test=np.array(x_test)
x_test=np.reshape(x_test,(x_test.shape[0],x_test.shape[1],1))

predicted_prices=model.predict(x_test)
predicted_prices=scaler.inverse_transform(predicted_prices)

#Plot graph
plt.figure(figsize=(12, 6))
plt.plot(acutual_prices,color='black',label=f'Actual {company} Price')
plt.plot(predicted_prices,color='blue',label=f'Predicted {company} Price')
plt.title(f'{company} Stock Prices Prediction')
plt.xlabel('Time')
plt.ylabel(f'{company} Price USD')
plt.legend()
plt.show()

#Predict next day

real_data = model_inputs[len(model_inputs)-prediction_days:len(model_inputs)]
real_data = real_data.reshape(1, prediction_days, 1)

prediction = model.predict(real_data)
prediction = scaler.inverse_transform(prediction)
print('Prediction:', prediction)
