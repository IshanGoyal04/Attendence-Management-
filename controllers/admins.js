const User = require('../models/user');

module.exports.employeesList = async (req, res) => {
    const users = await User.find()
    res.render('admin/list', { users })
}

module.exports.renderAddEmployee = async (req, res) => {
    res.render('admin/add');
    // res.send(req.body)
}

module.exports.addEmployee = async (req, res) => {

    insertRecord(req, res);

};

const insertRecord = async function (req, res) {
    try {
        const { email, username, password, eid, designation, contactNumber, address, city } = req.body;
        const user = await new User({ email, username, contactNumber, address, city, eid, designation });
        const registeredUser = await User.register(user, password);

        //console.log(registeredUser)
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Successfully Registered');
            res.redirect('admins/list')
        })


    } catch (e) {
        req.flash('error', e.message)
        res.redirect('admins/list')
    }

}

module.exports.renderEdit = async (req, res) => {

    const { id } = req.params;
    const user = await User.findById(id)

    if (!user) {
        req.flash('error', 'Cannot find Employee')
        return res.redirect('admins/list');
    }
    res.render('admin/edit', { user });

}

module.exports.updateEmployee = async (req, res) => {

    updateRecord(req, res);
    res.redirect('/admins/list')

}
const updateRecord = async function (req, res) {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user })
    req.flash('success', 'Successfully Updated the details of Employee')
    await user.save();
    res.redirect(`admins/${user._id} `)

}

module.exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    // req.flash('success', 'Successfully deleted a campground')
    res.redirect('/admins/list')

}

module.exports.renderEmployeeAttendence = async (req, res) => {


    try {
        const user = await User.findById(req.params.id);
        res.render('admin/seeattendence', { user })
        //let hours = 0;
        //let time = 0;
        // if (user.attendance.length > 0) {
        //     user.attendance.reverse();
        //
        //     user.attendance.map(a => {
        //         //var today = new Date();
        //         //var date1;
        //         //  if (today.getMonth() + 1 < 10) {
        //         //      date1 = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + today.getDate();
        //         //  }
        //         //  else {
        //         //      date1 = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        //         //  }
        //         //  console.log(date1);
        //         //const d = a.date.toISOString().slice(0, 10);
        //
        //         //if (d === date1) {
        //         // console.log(d)
        //         //console.log(date1)
        //
        //
        //         if (a.entry && a.exit.time) {
        //             hours = hours + calculateHours(a.entry.getTime(), a.exit.time.getTime());
        //             // console.log(a.entry.toString())
        //
        //
        //         }
        //         // }
        //
        //     })
        //     hours = parseFloat(hours / (3600 * 1000)).toFixed(4);
        //     const f = parseInt(hours);
        //     const s = parseInt((hours - f) * 60);
        //     const t = parseInt(((hours - f) * 60 - s) * 60);
        //console.log(f, s, t)
        // time = f + ':' + s + ':' + t;
        // }

    } catch (error) {
        console.log(error);
        req.flash('error', 'Cannot find user');
        res.redirect('admins/list')
    }
};
function calculateHours(entryTime, exitTime) {
    let time = 0;
    time = (exitTime - entryTime);
    return time;
}

module.exports.markApprove = async (req, res) => {

    const { id, ID } = req.params;
    const user = await User.findById(id)
    const attendences = user["attendance"];
    for (let attendance of attendences) {
        if (attendance._id.equals(ID)) {
            attendance.status = "Approved";

            await user.save()
            break;
        }
    }
    res.redirect(`/admins/${id}/employees/${id}`)
}

module.exports.markReject = async (req, res) => {

    const { id, ID } = req.params;
    const user = await User.findById(id)
    const attendences = user["attendance"];
    for (let attendance of attendences) {
        if (attendance._id.equals(ID)) {
            attendance.status = "Rejected";

            await user.save()
            break;
        }
    }
    res.redirect(`/admins/${id}/employees/${id}`)
}