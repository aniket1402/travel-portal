import { UserDetails } from "../signin/userDetails";

export class TicketDetail {
  constructor(
    public id = '',
    public locationCity = '',
    public travelCity = '',
    public startDate = new Date(),
    public endDate = new Date(),
    public requestType = '',
    public priority = 'Normal',
    public submittedDate = new Date(),
    public passportNumber = '',
    public projectName = '',
    public expenseBorneBy = '',
    public travelApproverName = '',
    public expectedDuration = '',
    public upperBoundOnAmt = '',
    public additionalDetails = '',
    public status = 'SUBMITTED',
    public user = new UserDetails(),
  ) { }
}