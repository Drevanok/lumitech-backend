interface SensorData {
    rosette_mac: string;
    temperature: number;
    humidity: number;
  }
  
  interface SensorValue {
    timestamp: number;
    valor: number;
  }
  
  interface SensorInfoResponse {
    msg: string;
    data: {
      temperature: SensorValue;
      humidity: SensorValue;
    } | null;
  }
  

  export { SensorData, SensorValue, SensorInfoResponse };