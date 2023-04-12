import { MongoClient } from 'mongodb';

import config from './config.js';



export const client = new MongoClient(config.DB_URI, { useNewUrlParser: true });
export let db = null;



export async function connectToMongoDB() {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(config.DB_DATABASE_NAME);
}


export async function closeMongoDBConnection() {
    return new Promise(async (resolve, reject) => {
        console.log("closeMongoDBConnection()");
        try {
            await client.close()
                .then(() => {
                    console.log("Closed MongoDB connection");
                    resolve();
                });
        } catch (error) {
            console.error("Error closing MongoDB connection: ", error);
            reject(error);
        }
    });
}


export async function setValue(name, value) {
    try {
        const collection = db.collection(config.DB_COLLECTION_NAME);
        await collection.updateOne({ name: name }, {
            $set: { value: value }
        }, { upsert: true });
    } catch (error) {
        console.error(error);
    }
}


export async function getValue(name) {
    try {
        const collection = db.collection(config.DB_COLLECTION_NAME);
        const item = await collection.findOne({ name: name });

        if (!item)
            return null;

        return item.value;

    } catch (error) {
        console.error(error);
    }
}



export async function getUsersWithUnit() {
    try {
        const collection = db.collection('users');
        const users = await collection.find({ unit: { $exists: true, $ne: '' } }).toArray();

        if (!users || users.length === 0)
            return null;

        return users;

    } catch (error) {
        console.error(error);
    }
}



export async function addUser(user_chat_id, unit) {
    try {
        const collection = db.collection('users');
        const newUser = {
            user_chat_id: user_chat_id,
            unit: unit,
            call: null
        };

        const result = await collection.insertOne(newUser);

        if (result.insertedCount !== 1) {
            console.error('Failed to insert the new user');
            return null;
        }

        return newUser;

    } catch (error) {
        console.error(error);
    }
}


export async function userExists(telegram_chat_id) {
    try {
        const collection = db.collection('users');
        const user = await collection.findOne({ user_chat_id: telegram_chat_id });

        return !!user;

    } catch (error) {
        console.error(error);
        return false;
    }
}



export async function getUserUnit(telegram_chat_id) {
    try {
        const collection = db.collection('users');
        const user = await collection.findOne({ user_chat_id: telegram_chat_id });

        if (!user)
            return null;

        return user.unit;

    } catch (error) {
        console.error(error);
        return false;
    }
}


export async function updateUserUnit(user_chat_id, unit) {
    try {
        const collection = db.collection('users');
        const result = await collection.updateOne(
            { user_chat_id: user_chat_id },
            { $set: { unit: unit } }
        );

        if (result.modifiedCount !== 1) {
            console.error('Failed to update the user unit');
            return false;
        }

        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}


export async function getAllUsers() {
    try {
        const collection = db.collection('users');
        const users = await collection.find({}).toArray();

        if (!users || users.length === 0)
            return null;

        return users;

    } catch (error) {
        console.error(error);
    }
}







// export async function setPriceCeiling(ceiling) {
//     console.log("setting priceCeiling set: ", ceiling);
//     try {
//         const collection = db.collection("alerts");
//         await collection.updateOne({ name: "priceCeiling" }, {
//             $set: { value: ceiling }
//         }, { upsert: true });
//     } catch (error) {
//         console.error(error);
//     }
// }



// export async function getPriceCeiling() {
//     try {
//         const collection = db.collection("alerts");

//         const alert = await collection.findOne({ name: "priceCeiling" });
//         // console.log("alert: ", alert);

//         if (!alert) {
//             return null;
//         }

//         return alert.value;
//     } catch (error) {
//         console.error(error);
//     }
// }

// export async function setPriceFloor(floor) {
//     console.log("setting priceFloor set: ", floor);
//     try {
//         const collection = db.collection("alerts");
//         await collection.updateOne({ name: "priceFloor" }, {
//             $set: { value: floor }
//         }, { upsert: true });
//     } catch (error) {
//         console.error(error);
//     }
// }


// export async function getPriceFloor() {
//     try {
//         const collection = db.collection("alerts");

//         const alert = await collection.findOne({ name: "priceFloor" });
//         // console.log("alert: ", alert);

//         if (!alert) {
//             return null;
//         }

//         return alert.value;

//     } catch (error) {
//         console.error(error);
//     }
// }














// const devices = [
//     { deviceId: "device1", ipAddress: "192.168.1.100", status: "active", miningCapacity: 10 },
//     { deviceId: "device2", ipAddress: "192.168.1.101", status: "active", miningCapacity: 20 },
//     { deviceId: "device3", ipAddress: "192.168.1.102", status: "inactive", miningCapacity: 30 }
// ];

// async function insertDevices() {
//     try {
//         await client.connect();
//         const db = client.db("test");
//         const collection = db.collection("devices");

//         // Insert multiple documents
//         await collection.insertMany(devices);
//         console.log("Devices inserted");
//     } catch (error) {
//         console.error(error);
//     } finally {
//         await client.close();
//     }
// }



// async function updateDeviceStatus(deviceId, status) {
//     try {
//         await client.connect();
//         const db = client.db("test");
//         const collection = db.collection("devices");

//         // Update a single document
//         await collection.updateOne({ deviceId: deviceId }, { $set: { status: status } });
//         console.log("Device status updated");
//     } catch (error) {
//         console.error(error);
//     } finally {
//         await client.close();
//     }
// }

// updateDeviceStatus("device1", "inactive");


// async function getDevices() {
//     try {
//         await client.connect();
//         const db = client.db("test");
//         const collection = db.collection("devices");
//         // Find all documents in the collection
//         const devices = await collection.find({}).toArray();
//         console.log(devices);
//     } catch (error) {
//         console.error(error);
//     } finally {
//         await client.close();
//     }
// }
