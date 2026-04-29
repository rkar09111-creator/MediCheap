import express from 'express';
import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const changeRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateHealthProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, {
      healthProfile: req.body
    }, { new: true });
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, {
      $push: { savedAddresses: req.body }
    }, { new: true });
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const topUpWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);
    
    user.walletBalance += Number(amount);
    user.walletTransactions.push({
      amount: Number(amount),
      type: 'credit',
      description: 'Wallet Top-up'
    });

    await user.save();
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
