const User = require('../models/user');
const date = require('date-and-time');




//module.exports.index = async (req, res) => {
//    const user = await User.findById(req.params.id);
//    res.render('employees/checkIn', { user })
//}

module.exports.renderCheckIn = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        let hours = 0;
        let time = 0;
        if (user.attendance.length > 0) {
            user.attendance.reverse();

            user.attendance.map(a => {
                var today = new Date();
                var date1;
                if (today.getMonth() + 1 < 10) {
                    date1 = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + today.getDate();
                }
                else {
                    date1 = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                }
                //  console.log(date1);
                const d = a.date.toISOString().slice(0, 10);

                if (d === date1) {
                    // console.log(d)
                    //console.log(date1)


                    if (a.entry && a.exit.time) {
                        hours = hours + calculateHours(a.entry.getTime(), a.exit.time.getTime());
                        // console.log(a.entry.toString())
                    }
                }

            })
            hours = parseFloat(hours / (3600 * 1000)).toFixed(4);
            const f = parseInt(hours);
            const s = parseInt((hours - f) * 60);
            const t = parseInt(((hours - f) * 60 - s) * 60);
            //console.log(f, s, t)
            time = f + ':' + s + ':' + t;
        }

        res.render('employees/checkIn', { user, time })
    } catch (error) {
        console.log(error);
        req.flash('error', 'Cannot find user');
        res.redirect(`/employees/${req.params.id}`)
    }
}

function calculateHours(entryTime, exitTime) {
    let time = 0;
    time = (exitTime - entryTime);
    return time;
}


module.exports.markCkeckIn = async (req, res) => {

    try {
        const data = {
            entry: Date.now()
        };
        const user = await User.findById(req.params.id);
        const now = new Date();
        const attendences = user["attendance"];
        for (let attendance of attendences) {
            if (date.isSameDay(attendance.date, now)) {
                req.flash('error', "Already Punched In")
                return res.redirect(`/employees/${req.params.id}`)
            }
        }
        //if the user has an attendance array;

        if (user.attendance && user.attendance.length > 0) {
            //for a new checkin attendance, the last checkin
            //must be at least 24hrs less than the new checkin time;
            const lastCheckIn = user.attendance[user.attendance.length - 1];
            const lastCheckInTimestamp = lastCheckIn.date.getTime();
            // console.log(Date.now(), lastCheckInTimestamp);
            if (Date.now() > lastCheckInTimestamp + 100) {
                user.attendance.push(data);
                //console.log(user.attendance[user.attendance.length - 1].date.toDateString())
                //date1 = Date.now();
                //console.log(date1)
                //console.log(hours)

                user.isPresent = 200;
                await user.save();
                req.flash('success', 'You have been signed in for today');
                res.redirect(`/employees/${req.params.id}`)

            } else {
                req.flash("error", "You have signed in today already");
                res.redirect(`/employees/${req.params.id}`);
            }
        } else {
            user.isPresent = 200;
            user.attendance.push(data);
            await user.save();
            req.flash('success', 'You have been signed in for today');
            res.redirect(`/employees/${req.params.id}`)
        }

    } catch (error) {
        console.log("something went wrong");
        console.log(error);
    }
}

module.exports.onleave = async (req, res) => {
    const data = {
        entry: Date.now(),
        exit: {
            time: Date.now()
        },
        onleave: "Yes",
        status: "Pending"
    };
    const { id } = req.params;
    const now = new Date();
    const user = await User.findById(id)
    // console.log(user)
    const attendences = user["attendance"];
    for (let attendance of attendences) {
        if (date.isSameDay(attendance.date, now)) {
            req.flash("error", "Already Punched In")
            return res.redirect(`/employees/${req.params.id}`)
        }
    }


    user.attendance.push(data);

    await user.save();
    //console.log('Todays Ateendance already punched')
    return res.redirect(`/employees/${req.params.id}`);

}



module.exports.renderCheckout = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        res.render('employees/checkIn', { user });
    } catch (error) {
        console.log('Cannot find User');
    }
}

module.exports.markCheckout = async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.params.id });

        //check if there is an attendance entry
        if (user.attendance && user.attendance.length > 0) {

            //check whether the exit time of the last element of the attedance entry has a value
            const lastAttendance = user.attendance[user.attendance.length - 1];
            if (lastAttendance.exit.time) {
                req.flash('error', 'You Must checkIn First');
                res.redirect(`/employees/${req.params.id}`);
                return;
            }
            lastAttendance.exit.time = Date.now();
            user.isPresent = 100;

            await user.save();
            req.flash('success', 'You have Successfully Checked Out')
            res.redirect(`/employees/${req.params.id}`);

        } else { //if no entry
            req.flash('error', 'You do not have an attendance entry ');
            res.redirect(`/employees/${req.params.id}`)
        }
    } catch (error) {
        console.log('Cannot find User');
    }
}


module.exports.viewProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)

    if (!user) {
        req.flash('error', 'Cannot find Employee')
        return res.redirect('/login');
    }
    res.render('employees/profile', { user });

}

module.exports.editProfile = async (req, res) => {
    updateRecord(req, res);
}

const updateRecord = async function (req, res) {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user })
    req.flash('success', 'Successfully Updated the details of Employee')
    await user.save();
    res.redirect(`/employees/${user._id}`)
}

module.exports.changePasswrd = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
    if (!user) {
        req.flash('error', 'Cannot find Employee')
        return res.redirect('/login');
    }
    res.render('employees/chpassword', { user });
}

module.exports.setPassword = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user })
    user.changePassword(req.body.oldpassword, req.body.newpassword, function (e) { //predefined function in passport-local-mongoose
        if (e) {
            req.flash('error', 'e.message')
            res.redirect(`/employees/${user._id}`)
        }
    })
    await user.save();
    req.flash('success', 'Password Changed Successfully')
    res.redirect(`/employees/${user._id}`)
}

