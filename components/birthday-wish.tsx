'use client'; // Enables client-side rendering for this component

// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FaBirthdayCake, FaGift } from 'react-icons/fa';
import { GiBalloons } from 'react-icons/gi';

// Define type for Confetti component props
type ConfettiProps = {
  width: number;
  height: number;
}

// Dynamically import Confetti component
const DynamicConfetti = dynamic(() => import('react-confetti'), { ssr: false });

// Define color arrays for candles, balloons, and confetti
const candleColors = ['#FF6B6B', '#FF9F40', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFB6C1', '#FFD700'];
const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FF1493', '#00BFFF'];
const confettiColors = ['#FF6B6B', '#FF9F40', '#FFD700', '#4ECDC4', '#45B7D1', '#FFB6C1', '#FF1493', '#00BFFF'];

export default function BirthdayWish() {
  // State variables
  const [candlesLit, setCandlesLit] = useState<number>(0);
  const [balloonsPoppedCount, setBalloonsPoppedCount] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<ConfettiProps>({ width: 0, height: 0 });
  const [celebrating, setCelebrating] = useState<boolean>(false);

  // Constants
  const totalCandles: number = 5;
  const totalBalloons: number = 5;

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect to show confetti when all candles are lit and balloons are popped
  useEffect(() => {
    if (candlesLit === totalCandles && balloonsPoppedCount === totalBalloons) {
      setShowConfetti(true);
    }
  }, [candlesLit, balloonsPoppedCount]);

  // Function to light a candle
  const lightCandle = (index: number) => {
    if (index === candlesLit) {
      setCandlesLit(prev => prev + 1);
    }
  };

  // Function to pop a balloon
  const popBalloon = (index: number) => {
    if (index === balloonsPoppedCount) {
      setBalloonsPoppedCount(prev => prev + 1);
    }
  };

  // Function to start celebration
  const celebrate = () => {
    setCelebrating(true);
    setShowConfetti(true);
    const interval = setInterval(() => {
      setCandlesLit(prev => {
        if (prev < totalCandles) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 500);
  };

  return (
    // Main container with a vibrant gradient background
    <div className="min-h-screen bg-gradient-to-r from-pink-500 to-indigo-500 flex flex-col items-center justify-center p-4">
      {/* Animated wrapper for the card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Birthday card */}
        <Card className="mx-auto overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl border-2 border-white rounded-lg">
          {/* Card header with birthday message */}
          <CardHeader className="text-center">
            <CardTitle className="text-5xl font-bold green">Happy Birthday!</CardTitle>
            <CardDescription className="text-2xl font-semibold text--900">Developer</CardDescription>
            <p className="text-lg text-100">September 2th</p>
          </CardHeader>
          {/* Card content with candles and balloons */}
          <CardContent className="space-y-6 text-center">
            {/* Candles section */}
            <div>
              <h3 className="text-lg font-semibold text- mb-9">Light the candles:</h3>
              <div className="flex justify-center space-x-2">
                {/* Map through candles */}
                {[...Array(totalCandles)].map((_, index) => (
                  <AnimatePresence key={index}>
                    {/* Render lit or unlit candle based on state */}
                    {(celebrating && index <= candlesLit) || (!celebrating && index < candlesLit) ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.5, delay: celebrating ? index * 0.5 : 0 }}
                      >
                        {/* Lit candle */}
                        <FaBirthdayCake
                          className={`w-8 h-8 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-125`}
                          style={{ color: candleColors[index % candleColors.length] }}
                          onClick={() => lightCandle(index)}
                        />
                      </motion.div>
                    ) : (
                      // Unlit candle
                      <FaBirthdayCake
                        className={`w-8 h-8 text-gray-300 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-125`}
                        onClick={() => lightCandle(index)}
                      />
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>
            {/* Balloons section */}
            <div>
              <h3 className="text-lg font-semibold text- mb-8">Pop the balloons:</h3>
              <div className="flex justify-center space-x-2">
                {/* Map through balloons */}
                {[...Array(totalBalloons)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 1 }}
                    animate={{ scale: index < balloonsPoppedCount ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Balloon icon */}
                    <GiBalloons
                      className={`w-8 h-8 cursor-pointer hover:scale-125`}
                      style={{ color: index < balloonsPoppedCount ? '#D1D5DB' : balloonColors[index % balloonColors.length] }}
                      onClick={() => popBalloon(index)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
          {/* Card footer with celebrate button */}
          <CardFooter className="flex justify-center">
            <Button 
              className="bg-black text-white hover:bg-gray-800 transition-all duration-300"
              onClick={celebrate}
              disabled={celebrating}
            >
              Celebrate! <FaGift className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      {/* Copyright and heart shape */}
      <div className="mt-6 flex items-center text-white">
        <span className="mr-3">© Zeenat Somroo</span>
        <div className="w-6 h-6 relative">
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-red-500rounded-full transform -translate-x-1/2" />
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2" style={{ borderRadius: '50% 50% 0 0' }} />
          <div className="w-6 h-3 bg-red-00 rounded-b-full" />
        </div>
      </div>
      {/* Confetti component */}
      {showConfetti && (
        <DynamicConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={10000}
          colors={confettiColors}
        />
      )}
    </div>
  );
}
