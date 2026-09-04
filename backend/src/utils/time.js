/**
 * Time utility functions for SIGNAL
 */

const getAwayDuration = (fromDate, toDate = new Date()) => {
  if (!fromDate) return { days: 0, hours: 0, minutes: 0 };
  const diffMs = Math.max(0, new Date(toDate).getTime() - new Date(fromDate).getTime());
  const totalMinutes = Math.floor(diffMs / (60 * 1000));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes, totalMinutes, diffMs };
};

const isWithinQuietHours = (startStr = '22:00', endStr = '08:00', testDate = new Date()) => {
  const currentMinutes = testDate.getHours() * 60 + testDate.getMinutes();
  const [sH, sM] = startStr.split(':').map(Number);
  const [eH, eM] = endStr.split(':').map(Number);
  const startMinutes = sH * 60 + sM;
  const endMinutes = eH * 60 + eM;

  if (startMinutes > endMinutes) {
    // Overnight window (e.g. 22:00 to 08:00)
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
};

module.exports = {
  getAwayDuration,
  isWithinQuietHours
};
