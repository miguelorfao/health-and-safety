import React, { useState } from 'react';
import { Action } from '../types';

interface ActionLoggerProps {
  restaurantId: string;
  onAddAction: (action: Action) => void;
}

const ISSUE_TYPE_LABELS = {
  temperature: 'Temperature issue',
  hs_check: 'Health & safety issue',
  checklist: 'Checklist issue',
  other: 'Other issue',
} as const;

const ACTION_GUIDANCE = {
  temperature: 'Include the item, recorded temperature, safe limit, and what was done to make it safe.',
  hs_check: 'Record what failed, the immediate control put in place, and who was informed.',
  checklist: 'Note the missed task, why it was missed, and when it was completed or escalated.',
  other: 'Describe the issue clearly and record the action taken to control the risk.',
} as const;

const ActionLogger: React.FC<ActionLoggerProps> = ({
  restaurantId,
  onAddAction,
}) => {
  const [issueType, setIssueType] = useState<'temperature' | 'hs_check' | 'checklist' | 'other'>('temperature');
  const [issueId, setIssueId] = useState('');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [user, setUser] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !actionTaken || !user) return;

    const action: Action = {
      id: Date.now().toString(),
      restaurantId,
      issueType,
      issueId,
      description,
      actionTaken,
      timestamp: new Date(),
      user,
    };

    onAddAction(action);
    setIssueId('');
    setDescription('');
    setActionTaken('');
    setUser('');
    setSuccessMessage('Corrective action saved successfully.');
  };

  return (
    <div className="action-logger">
      <div className="action-logger__header">
        <h2>Log Corrective Action</h2>
        <p>
          Record what went wrong, what was done immediately, and who completed the follow-up.
        </p>
      </div>

      <div className="action-logger__tip">
        <strong>Location:</strong> Restaurant {restaurantId} · <strong>Issue type:</strong>{' '}
        {ISSUE_TYPE_LABELS[issueType]}
      </div>

      <form onSubmit={handleSubmit} className="action-logger__form">
        <div className="action-logger__card">
          <h3>Issue details</h3>
          <div className="action-logger__grid">
            <div className="action-logger__field">
              <label htmlFor="issueType">Issue Type</label>
              <select
                id="issueType"
                value={issueType}
                onChange={(e) => {
                  setIssueType(e.target.value as 'temperature' | 'hs_check' | 'checklist' | 'other');
                  setSuccessMessage('');
                }}
              >
                <option value="temperature">Temperature Issue</option>
                <option value="hs_check">H&amp;S Check Issue</option>
                <option value="checklist">Checklist Issue</option>
                <option value="other">Other Issue</option>
              </select>
            </div>

            <div className="action-logger__field">
              <label htmlFor="issueId">Issue Reference</label>
              <input
                id="issueId"
                type="text"
                value={issueId}
                onChange={(e) => {
                  setIssueId(e.target.value);
                  setSuccessMessage('');
                }}
                placeholder="Optional reference or log ID"
              />
            </div>
          </div>

          <div className="action-logger__field">
            <label htmlFor="description">Issue Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setSuccessMessage('');
              }}
              required
              rows={4}
              placeholder="Describe the issue, affected item or area, and what was found."
            />
            <small>{ACTION_GUIDANCE[issueType]}</small>
          </div>
        </div>

        <div className="action-logger__card">
          <h3>Follow-up action</h3>
          <div className="action-logger__field">
            <label htmlFor="actionTaken">Action Taken</label>
            <textarea
              id="actionTaken"
              value={actionTaken}
              onChange={(e) => {
                setActionTaken(e.target.value);
                setSuccessMessage('');
              }}
              required
              rows={4}
              placeholder="Explain the corrective action taken, disposal, retraining, escalation, or recheck completed."
            />
          </div>

          <div className="action-logger__field">
            <label htmlFor="user">Completed By</label>
            <input
              id="user"
              type="text"
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
                setSuccessMessage('');
              }}
              required
              placeholder="Name of manager or staff member"
            />
          </div>
        </div>

        {successMessage && <p className="action-logger__success">{successMessage}</p>}

        <button type="submit" className="action-logger__submit">Save Corrective Action</button>
      </form>
    </div>
  );
};

export default ActionLogger;