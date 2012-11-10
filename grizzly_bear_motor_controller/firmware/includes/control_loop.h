#ifndef CONTROL_LOOP_H_
#define CONTROL_LOOP_H_
// This file contains code for the main control loop.
// PID, etc. code is in here.

#include "avr-fixed.h"

#include "util_macro.h"

// Motor controller modes
#define MODE_ENABLE_MASK                0x01

#define MODE_SPEED_MASK                 0x06
#define MODE_SPEED_RAW                  0x00
#define MODE_SPEED_NO_PID               0x02
#define MODE_SPEED_PID                  0x04

#define MODE_SIGN_MAG_LOCKED_ANTIPHASE  0x08
#define MODE_SIGN_MAGNITUDE             0x00
#define MODE_LOCKED_ANTIPHASE           0x08

#define MODE_SM_SWITCH_MODE             0x10
#define MODE_SM_GO_COAST                0x00
#define MODE_SM_GO_BRAKE                0x10

#define MODE_SPECIAL_STRESS       0x80

// Current mode setting
// NOTE: one byte; does not need ATOMIC_BLOCK
extern unsigned char pwm_mode;
// Current speed setting. May be interpreted differently depending on mode.
DECLARE_I2C_REGISTER(FIXED1616, target_speed);

// Called to configure control loop internal state on startup.
extern void init_control_loop(void);
// Called to update control loop.
extern void run_control_loop(void);

#endif  // CONTROL_LOOP_H_
