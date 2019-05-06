const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


const cars = [];
const measures = [];

app.get('/', (req, res)=>{
    return res.send("Welcome to go far test method");
});

app.post('/car/:id([A-Z]{2}[0-9]{4})', (req, res)=>{
    try{
        if(cars.find(x=>x.id==req.params.id)!=null){
            return res.status(400).send({message:"The car with the ID already exists."});
        }
        const car = {
            id:req.params.id
        };
        cars.push(car);
        return res.status(200).send(car);
    }
    catch(e){
        return res.status(500).send({message:"Sorry, Couldn't save the car information. An error has been occured."});    
    }
});

app.post('/measure/:id', (req, res)=>{
    try{
        const car = cars.find(x=>x.id==req.params.id);
        if(car==null){
            return res.status(400).send({message:"Car not found."});
        }
        const measure = {
            carId:req.params.id,
            timestamp:req.body.timestamp,
            speed:req.body.speed
        };
        measures.push(measure);
        return res.status(200).send(measure);
    }
    catch(e){
        return res.status(500).send({message:"Sorry, Couldn't save the measure information. An error has been occured."});    
    }
});


app.get('/averageSpeed/:id', (req, res)=>{
    try{
        const carMeasures = measures.filter(x=>x.carId==req.params.id);
        if(carMeasures==null || carMeasures.length==0){
            return res.status(400).send({message:"Car not found."});
        }
        var totalSpeed = 0;
        for(var i=0; i<carMeasures.length; i++){
            totalSpeed+= carMeasures[i].speed;
        } 
        return res.status(200).send({average:totalSpeed/carMeasures.length});
    }
    catch(e){
        return res.status(500).send({message:"Sorry, Couldn't return the average speed. An error has been occured."});    
    }
});


app.listen(3000, ()=>{
    console.log('app is running...');
});