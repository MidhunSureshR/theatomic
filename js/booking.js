/*
Booking script for theatomic; interacts with Firebase Firestore.
Copyright (C) 2021 R Midhun Suresh <rmidhunsuresh@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

class BookingHandler {
    constructor() {
        this._initFirebase();
    }

    _initFirebase() {
        var firebaseConfig = {
            apiKey: "AIzaSyDPB8nhQFAO0iWO8RomBEdqx0deSb9pp4M",
            authDomain: "atomic-c6046.firebaseapp.com",
            projectId: "atomic-c6046",
            storageBucket: "atomic-c6046.appspot.com",
            messagingSenderId: "475323317087",
            appId: "1:475323317087:web:f8440a01e8901b9b6694ea",
            measurementId: "G-CDJVPTFCTR"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
    }

    get store() {
        if (!this._store)
            this._store = firebase.firestore();
        return this._store;
    }

    _getTextFromSelect(id) {
        const e = document.querySelector(id);
        return e.options[e.selectedIndex].text;
    }

    _getValues() {
        let obj = {};
        obj.fullName = document.querySelector("#Name").value;
        obj.email = document.querySelector("#Email").value;
        obj.phoneNumber = document.querySelector("#Phone").value;
        obj.companyName = document.querySelector("#Company").value;
        obj.requirement = this._getTextFromSelect("#Requirement")
        obj.noOfSeats = this._getTextFromSelect("#Seat");
        obj.additionalNotes = document.querySelector("#AdditionalNotes").value;
        return obj;
    }

    /**
     * Get suffix of a date. See example for details. 
     * @param {Number} d | date
     * @returns {String} | suffix in date
     * @example
     * _get_nth(9)
     * Returns th [9th]
     * _get_nth(21)
     * Returns st [21st]
     */
    _get_nth(d) {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }


    _getDate() {
        const t = new Date();
        const suffix = this._get_nth(t.getDate());
        let date = t.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        /* Bad backend code dictates that the date needs to be
        in format April 9th, 2021 instead of April 9, 2021*/
        date = date.replace(",", suffix + ",");
        return date;
    }

    storeBooking() {
        const v = this._getValues();
        this.store.collection("enquiries")
            .add({
                ...v,
                createdAt: this._getDate(),
                status: true,
                to: "hey@theatomic.space",
                message: {
                    subject: "You have received a new enquiry",
                    text: "You have received a new enquiry.",
                    html: `
    You have received a new enquiry.<br><br>
    Full Name : ${v.fullName}<br>
      Email : ${v.email}<br>
      Phone Number : ${v.phoneNumber}<br>
      Company Name : ${v.companyName}<br>
      Requirement : ${v.requirement}<br>
      Number of Seats : ${v.noOfSeats}<br>
      Additional Notes : ${v.additionalNotes ? v.additionalNotes : "N/A"
                        }<br>
      `,
                },
            })
    }
}

let booking = new BookingHandler();
