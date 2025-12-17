# Exhibit 13 Implementation: Combined Storage System

## Overview

This document details the implementation of **Exhibit 13 - Lake Level Release Restriction Accounting Memorandum** from the Choctaw-Chickasaw Water Settlement Agreement.

## Key Principle: Combined Storage

Unlike simple individual lake thresholds, the settlement uses **combined storage percentage across Oklahoma City's entire reservoir system** to determine withdrawal restrictions from Sardis Lake.

### Why Combined Storage?

The settlement recognizes that Oklahoma City manages water across multiple reservoirs as an interconnected system. Restricting withdrawals based solely on Sardis Lake level would be inequitable if OKC has abundant water in other reservoirs. Conversely, allowing withdrawals when the entire system is stressed would threaten the settlement's environmental protections.

## Oklahoma City Reservoir System

Per Exhibit 13, Oklahoma City's system includes **six reservoirs**:

| City Reservoir | Top Elev (MSL) | Lower Elev (MSL) | Max Live Stor (AF) | 75% MSL | 65% MSL | 50% MSL |
|----------------|----------------|------------------|--------------------|---------|---------|---------|
| Atoka          | 590.0          | 550.0            | 107,940            | n/a     | n/a     | n/a     |
| Canton         | 1,615.4        | 1,596.5          | 68,023             | n/a     | n/a     | n/a     |
| Draper         | 1,191.0        | 1,145.0          | 72,195             | 1,183.1 | 1,179.5 | 1,173.7 |
| Hefner         | 1,199.0        | 1,165.0          | 57,993             | 1,193.1 | 1,190.4 | 1,186.1 |
| McGee          | 577.1          | 533.0            | 88,445             | n/a     | n/a     | n/a     |
| Overholser     | 1,241.5        | 1,231.8          | 12,909             | n/a     | n/a     | n/a     |
| **Total**      |                |                  | **407,105**        |         |         |         |

## Combined Storage Calculation

### Formula

```
Combined Storage (%) = (Total Current Storage / Total System Capacity) × 100
```

Where:
- **Total Current Storage** = Sum of storage across all 6 reservoirs (in acre-feet)
- **Total System Capacity** = 407,105 acre-feet

### Individual Reservoir Storage

For each reservoir:

```
Storage (AF) = Max Live Storage × ((Current Elevation - Lower Elevation) / (Top Elevation - Lower Elevation))
```

## Settlement Thresholds

Per Exhibit 13, withdrawal restrictions are triggered at specific combined storage percentages:

| Combined Storage % | Status   | Description                                    |
|--------------------|----------|------------------------------------------------|
| ≥ 75%              | Normal   | Full withdrawal rights, normal operations      |
| 65% - 75%          | Watch    | Heightened monitoring, no restrictions yet     |
| 50% - 65%          | Warning  | Potential restrictions, increased conservation |
| < 50%              | Critical | Withdrawal restrictions may apply              |

## Sardis Lake Withdrawal Restrictions

Oklahoma City's ability to withdraw water from Sardis Lake depends on:

1. **Combined OKC System Storage Percentage** (primary factor per Exhibit 13)
2. **Sardis Lake Individual Level** (secondary factor, minimum 590 ft NGVD29)
3. **ODWC Lake Level Management Plan recommendations**

### Restriction Logic

```typescript
function isSardisWithdrawalAllowed(sardisLevel: number, combinedStoragePercent: number): boolean {
  // Must meet BOTH criteria:
  // 1. Sardis at or above minimum withdrawal level (590 ft)
  // 2. Combined OKC system storage above critical threshold

  return sardisLevel >= 590.0 && combinedStoragePercent >= 50.0
}
```

## Implementation Files

### Core Logic
- **`lib/okcReservoirSystem.ts`**: Configuration and calculations for the 6-reservoir system
  - Reservoir definitions with elevations and capacities
  - Storage calculation functions
  - Combined storage percentage calculation
  - Status determination and restriction logic

### Components
- **`components/OKCSystemStatus.tsx`**: Dashboard widget showing combined system status
  - Real-time combined storage percentage
  - Visual progress bar with threshold markers
  - Individual reservoir breakdown
  - Settlement alert messages

### Data
- **`lib/mockData.ts`**: Simulated data for all OKC reservoirs
  - Realistic elevation levels (70-85% capacity)
  - Configurable for testing different scenarios

## Example Scenarios

### Scenario 1: Normal Operations
- **Combined Storage**: 320,000 AF (78.6%)
- **Status**: Normal ✅
- **Sardis Withdrawals**: Allowed (if Sardis > 590 ft)

### Scenario 2: Watch Status
- **Combined Storage**: 285,000 AF (70.0%)
- **Status**: Watch ⚠️
- **Sardis Withdrawals**: Allowed but monitored

### Scenario 3: Critical Status
- **Combined Storage**: 195,000 AF (47.9%)
- **Status**: Critical 🚨
- **Sardis Withdrawals**: **RESTRICTED** per settlement agreement

Even if Sardis Lake itself is at full pool, withdrawals would be restricted if the combined OKC system falls below the critical threshold.

## Settlement Compliance

This implementation ensures compliance with:

1. **Exhibit 13**: Lake Level Release Restriction Accounting Memorandum
2. **ODWC Recommendations**: Oklahoma Department of Wildlife Conservation lake level management plan
3. **Settlement Agreement**: Protections for recreation, fish, and wildlife resources
4. **Tribal Rights**: Choctaw and Chickasaw Nations' senior water rights

## Data Sources

- **USGS Real-time Data**: For Atoka (07334200) and McGee Creek (07333900)
- **Estimated Data**: For Canton, Draper, Hefner, and Overholser (where real-time USGS feeds aren't available in settlement docs)
- **Settlement Documents**: Exhibit 13, Exhibit 2, and related appendices from waterunityok.com

## Future Enhancements

1. **Real-time Integration**: Connect to all OKC reservoir data sources when available
2. **Historical Analysis**: Track combined storage trends over time
3. **Drought Planning**: Model scenarios and project future system status
4. **Automated Alerts**: Email/SMS notifications when approaching thresholds
5. **API Endpoint**: Provide combined storage data via REST API for other applications

## Technical Notes

### Why Some Reservoirs Lack Percentage Elevations

In the table, Atoka, Canton, McGee, and Overholser show "n/a" for 75%/65%/50% elevations. This is because:

1. These elevations aren't needed for the calculation (we compute storage from current elevation)
2. The settlement focuses on **combined** percentages, not individual reservoir percentages
3. Only Draper and Hefner have specific management elevations documented for those thresholds

### Accuracy Considerations

The mock implementation simulates the OKC system with realistic estimates. In production:

- Atoka and McGee use real USGS data
- Canton, Draper, Hefner, and Overholser would use Oklahoma City Water Utilities Trust data
- Combined calculation would be performed server-side with authoritative data sources

## References

- [Water Unity Oklahoma - Exhibit List](https://www.waterunityok.com/media/1067/exhibit-list-160808.pdf)
- [Exhibit 13: Lake Level Release Restriction Accounting](https://www.waterunityok.com/media/1064/exhibit-13-160808.pdf)
- [Federal Register - Settlement Statement of Findings](https://www.federalregister.gov/documents/2024/02/28/2024-04013/statement-of-findings-choctaw-nation-of-oklahoma-and-the-chickasaw-nation-water-rights-settlement)
- [StateImpact Oklahoma - Water Settlement Explainer](https://stateimpact.npr.org/oklahoma/2016/08/12/inside-the-landmark-state-and-tribal-agreement-that-ends-standoff-over-water-in-southeast-oklahoma/)

## Summary

The combined storage system represents a sophisticated approach to water management that:

- **Protects tribal rights** by ensuring OKC doesn't overuse Sardis when their own system is stressed
- **Ensures environmental protections** for Sardis Lake recreation and wildlife
- **Provides operational flexibility** for Oklahoma City's water management
- **Creates transparency** through real-time monitoring and public display

This implementation brings the settlement agreement's intent to life through modern web technology and data visualization.
