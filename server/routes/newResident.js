// Backend (Node.js/Express)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Resident = require('../models/newMemberResident'); // Your Resident model
const dayjs = require('dayjs');
const Payment = require('../models/Payment');
 router.post('/',async(req,res)=>{
    try {
        const { name, email, mobileNumber, address, parentsName, parentsMobileNo, hostel, roomNumber , dateJoined, password,cash} = req.body;
        const formattedDate = dateJoined ? dayjs(dateJoined).format('YYYY-MM-DD') : null;
        const newResident = new Resident({
            name, email, mobileNumber, address, parentsName,
            parentsMobileNo, hostel, roomNumber,password,cash,
            dateJoined: formattedDate
          });
          await newResident.save();
    res.status(201).json(newResident);
    } catch (error) {
        console.error('Error creating resident or processing payment:', error);
        res.status(500).send('Internal Server Error');
    }  
 });

 router.get('/', async (req, res) => {
    try {
      const newResidents = await Resident.find();
     
      res.json(newResidents);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  router.get('/:id', async (req, res) => {
    try {
      const resident = await Resident.findById(req.params.id);
      if (!resident) {
        return res.status(404).json({ message: 'Resident not found' });
      }
      
      // console.log(`Generating payments for resident: ${resident._id}, contract end date: ${resident.contract}`);
      // await generateMonthlyPayments(resident._id, resident.contract);
      res.json(resident);
    } catch (error) {
      console.error('Error fetching resident or generating payments:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  module.exports = router;
  

    // Payment successful, save user data
    module.exports = router;

    const generateMonthlyPayments = async (userId, contractEndDate) => {
     try {
      const startDate = dayjs().startOf('month');
      const endDate = dayjs(contractEndDate).endOf('month');
      let currentDate = startDate;
      const resident = await Resident.findById(userId);
      while (currentDate.isBefore(endDate)) {
        const month = currentDate.format('YYYY-MM');
        const existingPayment = await Payment.findOne({ userId, month });
    
        if (!existingPayment) {
          const payment = new Payment({
            userId,
            amount: 3000, // Replace with the appropriate amount
            month,
            date: currentDate.toDate(),
            status: 'due'
          });
    
          await payment.save();
          resident.payments.push(payment._id);
         
        }
    
        currentDate = currentDate.add(1, 'month');
        await resident.save();
      }
     } catch (error) {
      console.log(error);
     }
    };
    