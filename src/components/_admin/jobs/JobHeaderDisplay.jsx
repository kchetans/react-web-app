import React, {Component} from "react";
import {Paper} from "material-ui";

export default class JobHeaderDisplay extends Component {

  componentWillMount() {
    this.setState({info: this.props.info});
  }

  render() {
    let info = this.state.info
    // {"compensation":"Rs. 12000 / Month","job_id":"59e08849a39e73146577b606","cover_pic_url":"https://s3.ap-south-1.amazonaws.com/app-util-images/Others.png","city":"Bengaluru","type":"full_time","is_active":false,"type_text":"Full Time","title":"Cook Required for 2 people, 2 times dail ...","category":[{"value":"others","key":"Others"}],"description":"Cook Required for 2 people, 2 times daily, North-Indian Dishes!","time":"AN HOUR AGO","location":{"lat":12.9047583,"lng":77.5951035},"stats":{"matched":0,"hired":0,"applications":0,"closed":0,"interested":0,"offer_letter_rejected":0,"offer_letter_sent":0,"not_interested":0,"recommended":0}}


    let {is_active, compensation, city, description, cover_pic_url, type_text, job_id} = info;
    return (
      <Paper zDepth={1} className="my-job-header-display p-16 flex space-between mb-16">
        <div className="flex align-items-stretch">

          <img className="coverpic" src={cover_pic_url}/>
          <div className="job-details ml-16">
            <h3>{description}</h3>
            <div>
              <span className="type">{type_text}</span> | <span className="location">{city}</span>
            </div>
            <div className="salary">
              {compensation}
            </div>

          </div>
        </div>

      </Paper>
    );
  }
}
