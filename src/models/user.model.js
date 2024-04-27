import mongoose from "mongoose";
const commonSchema = new mongoose.Schema({
    
    referralCode:{
        type:String,
        unique:true
    },
    isReferred:{
        type:Boolean,
        default:false
    },
    isReferUsed:{
        type:Boolean,
        default:false
    },
    Level:{
        type:Number,
        default:1
    },
  
    referedCount:{type:Number,default:0},
    INR:{type:Number,default:0,min:0},
    life:{type:Number,default:5,max:5,min:0},
    coins:{type:Number,default:0},
    extraball:{type:Number,default:0},
    fireball:{type:Number,default:0},
    colorball:{type:Number,default:0},
    kycstatus:{type:Boolean,default:false},
    ExtraMoves:{type:Number,default:0},
    Hand:{type:Number,default:0,min:0},
    Bomb:{type:Number,default:0,min:0},
    Colorful_bomb:{type:Number,default:0,min:0},
    Random_color:{type:Number,default:0,min:0},
    Stripes:{type:Number,default:0,min:0},
    ExtraTime:{type:Number,default:0,min:0},
    Packages:{type:Number,default:0,min:0},
    

    Levels:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'level',

        }
    ],
    challenges:[
        { challengeId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'challenge',
        },
        referenceId:String,
        challengetype:String,
        

        
        }
    ],
   shops:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'shop',

        }
    ],
    timerbasedfreecoins:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'freecoinReward',

        }
    ],
    adbasedfreecoins:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'adbasedfreecoinReward',

        }
    ],
    adbasedfreelifes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'adbasedfreelifeReward',

        }
    ],
    dailyrewards:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'dailyreward',

        }
    ],

},
{timestamps:true})

const guestSchema = new mongoose.Schema({
    deviceID:{
        type:String,
        unique:true,
        required:true
    }
})
const authSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        required:true
        
    }
})
const facebookSchema = new mongoose.Schema({
    facebookID:{
        type:String,
        unique:true,
       
       
    }
})

 export const userModel = mongoose.model('user', commonSchema);
 export const facebookModel = userModel.discriminator('facebookPlayer',facebookSchema);
export  const guestModel = userModel.discriminator('guestPlayer', guestSchema);
export const authModel = userModel.discriminator('authPlayer', authSchema);