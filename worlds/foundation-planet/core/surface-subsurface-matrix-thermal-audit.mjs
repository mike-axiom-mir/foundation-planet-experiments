import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.82.0-r82.1';
import {
  SURFACE_ENERGY_LEDGER_SCHEMA
} from './snowmelt-cold-content.mjs?v=0.82.0-r82.1';
import {
  LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA
} from './deep-soil-subsurface-matrix-thermal.mjs?v=0.82.0-r82.1';
import {
  LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_PROPOSAL_SCHEMA,
  LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_CLOSURE_SCHEMA,
  LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
  LAND_SURFACE_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS,
  LAND_SURFACE_SUBSURFACE_MATRIX_MINIMUM_SURFACE_TEMPERATURE_C,
  LAND_SURFACE_SUBSURFACE_MATRIX_MAXIMUM_SURFACE_TEMPERATURE_C
} from './surface-subsurface-matrix-thermal.mjs?v=0.82.0-r82.1';
import {
  LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landDeepAquiferMatrixThermalReceiptValid
} from './deep-aquifer-matrix-thermal.mjs?v=0.83.0-r83.1';
import {
  LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landVadoseMatrixThermalReceiptValid,
  landNativeVadoseMatrixThermalReceiptValid
} from './vadose-matrix-thermal.mjs?v=0.85.0-r85.1';

const MATRIX_MINIMUM_TEMPERATURE_C = -20;
const MATRIX_MAXIMUM_TEMPERATURE_C = 80;
const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;
const clamp = (value, minimum, maximum) =>
  Math.max(minimum, Math.min(maximum, value));
const clone = value => JSON.parse(JSON.stringify(value));
const round = (value, digits = 12) =>
  Number(Number(value).toFixed(digits));

function stableDigest(value) {
  const text = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function receiptDigestValid(receipt) {
  if (!receipt || typeof receipt.digest !== 'string') return false;
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
}

function same(left, right, tolerance = 1e-12) {
  return Number.isFinite(Number(left)) && Number.isFinite(Number(right)) &&
    Math.abs(Number(left) - Number(right)) <= tolerance;
}

function surfaceOwnersMatch(left = {}, right = {}) {
  return left.ownerKind === 'land-surface-sensible-heat-owner' &&
    right.ownerKind === 'land-surface-sensible-heat-owner' &&
    same(left.heatCapacityJm2K, right.heatCapacityJm2K, 1e-6) &&
    same(left.temperatureC, right.temperatureC) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);
}

function serializedSurfaceOwnersMatch(left = {}, right = {}) {
  return left.ownerKind === 'land-surface-sensible-heat-owner' &&
    right.ownerKind === 'land-surface-sensible-heat-owner' &&
    same(left.heatCapacityJm2K, right.heatCapacityJm2K, 1e-6) &&
    same(left.temperatureC, right.temperatureC, 1e-6) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);
}

function matrixOwnersMatch(left = {}, right = {}) {
  return left.materialClass ===
      'parameterized-deep-subsurface-mineral-matrix' &&
    right.materialClass === left.materialClass &&
    same(left.upperBoundaryDepthM, right.upperBoundaryDepthM) &&
    same(left.lowerBoundaryDepthM, right.lowerBoundaryDepthM) &&
    same(left.effectiveDepthM, right.effectiveDepthM) &&
    same(left.separationToAquiferMatrixM,
      right.separationToAquiferMatrixM) &&
    same(left.solidFraction, right.solidFraction) &&
    same(left.volumetricHeatCapacityJm3K,
      right.volumetricHeatCapacityJm3K) &&
    same(left.heatCapacityJm2K, right.heatCapacityJm2K, 1e-6) &&
    same(left.temperatureC, right.temperatureC) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);
}

function independentlyBoundSurfaceEnergy(ledger = {}) {
  const owner = ledger.finalSurfaceSensibleHeatOwner || {};
  const binding = {
    schema: ledger.schema || null,
    stepId: ledger.stepId || null,
    finalSurfaceSensibleHeatOwner: {
      ownerKind: owner.ownerKind || null,
      heatCapacityJm2K: round(finite(owner.heatCapacityJm2K), 6),
      temperatureC: round(finite(owner.temperatureC), 6),
      sensibleHeatJm2: round(finite(owner.sensibleHeatJm2), 6)
    }
  };
  binding.bindingDigest = stableDigest(binding);
  return binding;
}

function closureAudit(actual, signedOperands) {
  const operands = signedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const scale = operands.reduce((sum, value) =>
    sum + Math.abs(value), 0);
  const tolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  const actualOperands = Array.isArray(actual?.signedOperands)
    ? actual.signedOperands : [];
  const valid = actual?.schema ===
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_CLOSURE_SCHEMA &&
    actual?.policy?.schema ===
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA &&
    actual.policy.kind === 'energy' &&
    same(actual.policy.absoluteFloor,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(actual.policy.ulpFactor,
      LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR) &&
    actual.policy.scaleBasis ===
      'sum-of-absolute-unrounded-signed-operands-joules-per-square-metre' &&
    actualOperands.length === operands.length &&
    actualOperands.every((value, index) =>
      same(value, operands[index],
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J)) &&
    same(actual.residual, residual,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(actual.numericTolerance, tolerance) &&
    actual.measuredResidualPreserved === true &&
    actual.closed === (Math.abs(residual) <= tolerance) &&
    actual.closed === true;
  return {
    valid,
    residual: Number(residual),
    tolerance,
    utilization: tolerance > 0 ? Math.abs(residual) / tolerance : 0
  };
}

function result(status, detail) {
  return {
    id: 'land-surface-subsurface-matrix-thermal-owner-lineage',
    required: true,
    status,
    statement: 'The current land-surface and adjacent persistent deep-subsurface-matrix sensible-heat owners exchange one signed, paired amount without changing either owner geometry.',
    detail
  };
}

export function auditLandSurfaceSubsurfaceMatrixThermal(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column?.land
    ?.lastSurfaceSubsurfaceMatrixThermalReceipt;
  if (!receipt) {
    const checkpoint = column?.land
      ?.surfaceSubsurfaceMatrixThermalMigrationCheckpoint === true;
    return result(column?.stepCount === 0 || checkpoint
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'v43-to-v44 migration preserves current owners without inventing historical R82 exchange evidence'
        : column?.stepCount === 0
          ? 'land column has not stepped yet'
          : 'a stepped current land column is missing its surface/subsurface-matrix thermal receipt'
    });
  }

  const proposal = receipt.sourceProposal?.proposal;
  const sourceR81 = column?.land?.deepSubsurfaceMatrixThermal
    ?.lastStepReceipt;
  const energy = column?.budget?.energy || {};
  const embeddedEnergy = receipt.sourceSurfaceEnergyLedger || {};
  const currentMatrixOwner = column?.land?.deepSubsurfaceMatrixThermal
    ?.owner || {};
  const downstreamDeepAquiferMatrixReceipt = column?.land
    ?.lastDeepAquiferMatrixThermalReceipt;
  const downstreamVadoseMatrixReceipt = column?.land
    ?.lastVadoseMatrixThermalReceipt;
  const currentSurfaceOwner = {
    ownerKind: 'land-surface-sensible-heat-owner',
    heatCapacityJm2K: Number(2.35e6 +
      finite(column?.substrate?.soilDepthM) * 1.15e6),
    temperatureC: Number(column?.surface?.temperatureC),
    sensibleHeatJm2: Number((2.35e6 +
      finite(column?.substrate?.soilDepthM) * 1.15e6) *
      finite(column?.surface?.temperatureC))
  };
  const initialSurfaceOwner = receipt.initialSurfaceOwner || {};
  const finalSurfaceOwner = receipt.finalSurfaceOwner || {};
  const initialMatrixOwner =
    receipt.initialDeepSubsurfaceMatrixOwner || {};
  const finalMatrixOwner =
    receipt.finalDeepSubsurfaceMatrixOwner || {};
  const heatToMatrixJm2 = Number(
    receipt.transfer?.signedHeatToMatrixJm2);

  const independentlyBoundEnergy =
    independentlyBoundSurfaceEnergy(energy);
  const sourceLineageValid =
    receipt.schema ===
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(receipt) &&
    column?.budget?.surfaceSubsurfaceMatrixThermal?.digest ===
      receipt.digest &&
    proposal?.schema ===
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_PROPOSAL_SCHEMA &&
    receiptDigestValid(proposal) &&
    receipt.sourceProposal?.receiptDigest === proposal.digest &&
    receipt.sourceProposal?.stepId === proposal.stepId &&
    sourceR81?.schema ===
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(sourceR81) &&
    receipt.sourceDeepSoilSubsurfaceMatrixThermal?.receiptDigest ===
      sourceR81.digest &&
    receipt.sourceDeepSoilSubsurfaceMatrixThermal?.stepId ===
      sourceR81.stepId &&
    proposal.sourceDeepSoilSubsurfaceMatrixThermal?.receiptDigest ===
      sourceR81.digest &&
    energy.schema === SURFACE_ENERGY_LEDGER_SCHEMA &&
    embeddedEnergy.bindingDigest ===
      independentlyBoundEnergy.bindingDigest &&
    proposal.sourceSurfaceEnergyLedger?.bindingDigest ===
      independentlyBoundEnergy.bindingDigest;

  const surfaceLowerBoundaryDepthM = clamp(
    finite(column?.substrate?.soilDepthM, .3), .03, 5.5);
  const matrixUpperBoundaryDepthM =
    Number(initialMatrixOwner.upperBoundaryDepthM);
  const signedInterfaceSeparationM =
    matrixUpperBoundaryDepthM - surfaceLowerBoundaryDepthM;
  const interfaceValid = receipt.interface?.mode ===
      'coincident-land-surface-deep-subsurface-matrix-interface' &&
    proposal?.interface?.mode === receipt.interface.mode &&
    same(receipt.interface.surfaceOwnerLowerBoundaryDepthM,
      surfaceLowerBoundaryDepthM) &&
    same(receipt.interface.matrixUpperBoundaryDepthM,
      matrixUpperBoundaryDepthM) &&
    same(receipt.interface.signedInterfaceSeparationM,
      signedInterfaceSeparationM) &&
    receipt.interface.boundariesCoincident === true &&
    receipt.interface.ownerIntervalsOverlap === false &&
    Math.abs(signedInterfaceSeparationM) <= 1e-12 &&
    same(finalMatrixOwner.upperBoundaryDepthM,
      initialMatrixOwner.upperBoundaryDepthM) &&
    same(finalMatrixOwner.lowerBoundaryDepthM,
      initialMatrixOwner.lowerBoundaryDepthM) &&
    same(finalMatrixOwner.effectiveDepthM,
      initialMatrixOwner.effectiveDepthM) &&
    same(finalMatrixOwner.heatCapacityJm2K,
      initialMatrixOwner.heatCapacityJm2K, 1e-6);

  const duration = Number(proposal?.durationDays);
  const surfaceCapacity = Number(initialSurfaceOwner.heatCapacityJm2K);
  const matrixCapacity = Number(initialMatrixOwner.heatCapacityJm2K);
  const responseFraction = 1 - Math.exp(-duration /
    LAND_SURFACE_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS);
  const jointCapacity = surfaceCapacity > 0 && matrixCapacity > 0
    ? surfaceCapacity * matrixCapacity /
      (surfaceCapacity + matrixCapacity) : 0;
  const requestedHeatToMatrixJm2 = jointCapacity *
    (Number(initialSurfaceOwner.temperatureC) -
      Number(initialMatrixOwner.temperatureC)) * responseFraction;
  const minimumHeatToMatrixJm2 = Math.max(
    surfaceCapacity * (Number(initialSurfaceOwner.temperatureC) -
      LAND_SURFACE_SUBSURFACE_MATRIX_MAXIMUM_SURFACE_TEMPERATURE_C),
    matrixCapacity * (MATRIX_MINIMUM_TEMPERATURE_C -
      Number(initialMatrixOwner.temperatureC)));
  const maximumHeatToMatrixJm2 = Math.min(
    surfaceCapacity * (Number(initialSurfaceOwner.temperatureC) -
      LAND_SURFACE_SUBSURFACE_MATRIX_MINIMUM_SURFACE_TEMPERATURE_C),
    matrixCapacity * (MATRIX_MAXIMUM_TEMPERATURE_C -
      Number(initialMatrixOwner.temperatureC)));
  const expectedHeatToMatrixJm2 = surfaceCapacity > 0 && matrixCapacity > 0
    ? clamp(requestedHeatToMatrixJm2,
      minimumHeatToMatrixJm2, maximumHeatToMatrixJm2) : 0;
  const proposalRecomputationValid = duration > 0 &&
    duration <= 1.000001 &&
    surfaceOwnersMatch(proposal?.initialSurfaceOwner,
      initialSurfaceOwner) &&
    matrixOwnersMatch(proposal?.initialDeepSubsurfaceMatrixOwner,
      initialMatrixOwner) &&
    proposal?.response?.mode ===
      'bounded-land-surface-deep-subsurface-matrix-interface-response' &&
    same(proposal.response.responseTimescaleDays,
      LAND_SURFACE_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS) &&
    same(proposal.response.responseFraction, responseFraction) &&
    same(proposal.response.surfaceHeatCapacityJm2K,
      surfaceCapacity, 1e-6) &&
    same(proposal.response.deepSubsurfaceMatrixHeatCapacityJm2K,
      matrixCapacity, 1e-6) &&
    same(proposal.response.jointHeatCapacityJm2K,
      jointCapacity, 1e-6) &&
    same(proposal.requestedHeatToMatrixJm2,
      requestedHeatToMatrixJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal.minimumHeatToMatrixJm2,
      minimumHeatToMatrixJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal.maximumHeatToMatrixJm2,
      maximumHeatToMatrixJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal.appliedHeatToMatrixJm2,
      expectedHeatToMatrixJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(heatToMatrixJm2, expectedHeatToMatrixJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const downstreamVadoseDeepBindingValid = downstreamVadoseMatrixReceipt
    ? downstreamVadoseMatrixReceipt.schema ===
        LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
      landVadoseMatrixThermalReceiptValid(
        downstreamVadoseMatrixReceipt) &&
      downstreamVadoseMatrixReceipt.sourceDeepAquiferMatrixThermal
        ?.receiptDigest === downstreamDeepAquiferMatrixReceipt?.digest &&
      matrixOwnersMatch(
        downstreamVadoseMatrixReceipt.initialPostR83DeepOwner,
        downstreamDeepAquiferMatrixReceipt
          ?.finalDeepSubsurfaceMatrixOwner) &&
      matrixOwnersMatch(
        downstreamVadoseMatrixReceipt.finalDeepSubsurfaceMatrixOwner,
        currentMatrixOwner) &&
      downstreamVadoseMatrixReceipt.truth
        ?.r83DirectTransferExplicitlyReconciled === true &&
      downstreamVadoseMatrixReceipt.truth
        ?.directTransferDoubleCounted === false
    : matrixOwnersMatch(downstreamDeepAquiferMatrixReceipt
      ?.finalDeepSubsurfaceMatrixOwner, currentMatrixOwner);
  const downstreamNativeVadoseDeepBindingValid =
    downstreamVadoseMatrixReceipt?.schema ===
      LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landNativeVadoseMatrixThermalReceiptValid(
      downstreamVadoseMatrixReceipt) &&
    downstreamVadoseMatrixReceipt.sourceSurfaceSubsurfaceMatrixThermal
      ?.receiptDigest === receipt.digest &&
    downstreamVadoseMatrixReceipt.sourceSurfaceSubsurfaceMatrixThermal
      ?.stepId === receipt.stepId &&
    matrixOwnersMatch(
      downstreamVadoseMatrixReceipt.initialDeepSubsurfaceMatrixOwner,
      finalMatrixOwner) &&
    matrixOwnersMatch(
      downstreamVadoseMatrixReceipt.finalDeepSubsurfaceMatrixOwner,
      currentMatrixOwner) &&
    downstreamVadoseMatrixReceipt.truth?.directDeepAquiferTransferApplied ===
      false &&
    downstreamVadoseMatrixReceipt.truth?.directTransferReversalApplied ===
      false;
  const downstreamMatrixOwnerBindingValid =
    downstreamNativeVadoseDeepBindingValid ||
    (downstreamDeepAquiferMatrixReceipt
      ? downstreamDeepAquiferMatrixReceipt.schema ===
          LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
        landDeepAquiferMatrixThermalReceiptValid(
          downstreamDeepAquiferMatrixReceipt) &&
        downstreamDeepAquiferMatrixReceipt
          .sourceSurfaceSubsurfaceMatrixThermal?.receiptDigest ===
            receipt.digest &&
        downstreamDeepAquiferMatrixReceipt
          .sourceSurfaceSubsurfaceMatrixThermal?.stepId === receipt.stepId &&
        matrixOwnersMatch(downstreamDeepAquiferMatrixReceipt
          .initialDeepSubsurfaceMatrixOwner, finalMatrixOwner) &&
        downstreamVadoseDeepBindingValid
      : !downstreamVadoseMatrixReceipt &&
        matrixOwnersMatch(finalMatrixOwner, currentMatrixOwner));
  const ownerBindingsValid =
    serializedSurfaceOwnersMatch(energy.finalSurfaceSensibleHeatOwner,
      initialSurfaceOwner) &&
    matrixOwnersMatch(sourceR81?.finalDeepSubsurfaceMatrixOwner,
      initialMatrixOwner) &&
    surfaceOwnersMatch(finalSurfaceOwner, currentSurfaceOwner) &&
    downstreamMatrixOwnerBindingValid &&
    same(finalSurfaceOwner.sensibleHeatJm2,
      Number(initialSurfaceOwner.sensibleHeatJm2) -
        heatToMatrixJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalMatrixOwner.sensibleHeatJm2,
      Number(initialMatrixOwner.sensibleHeatJm2) +
        heatToMatrixJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalSurfaceOwner.sensibleHeatJm2,
      Number(finalSurfaceOwner.heatCapacityJm2K) *
        Number(finalSurfaceOwner.temperatureC),
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalMatrixOwner.sensibleHeatJm2,
      Number(finalMatrixOwner.heatCapacityJm2K) *
        Number(finalMatrixOwner.temperatureC),
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    Number(finalSurfaceOwner.temperatureC) >=
      LAND_SURFACE_SUBSURFACE_MATRIX_MINIMUM_SURFACE_TEMPERATURE_C &&
    Number(finalSurfaceOwner.temperatureC) <=
      LAND_SURFACE_SUBSURFACE_MATRIX_MAXIMUM_SURFACE_TEMPERATURE_C &&
    Number(finalMatrixOwner.temperatureC) >=
      MATRIX_MINIMUM_TEMPERATURE_C &&
    Number(finalMatrixOwner.temperatureC) <=
      MATRIX_MAXIMUM_TEMPERATURE_C;

  const paired = closureAudit(receipt.pairedTransferClosure, [
    -heatToMatrixJm2, heatToMatrixJm2
  ]);
  const surface = closureAudit(receipt.surfaceOwnerClosure, [
    Number(finalSurfaceOwner.sensibleHeatJm2),
    -Number(initialSurfaceOwner.sensibleHeatJm2),
    heatToMatrixJm2
  ]);
  const matrix = closureAudit(
    receipt.deepSubsurfaceMatrixOwnerClosure, [
      Number(finalMatrixOwner.sensibleHeatJm2),
      -Number(initialMatrixOwner.sensibleHeatJm2),
      -heatToMatrixJm2
    ]);
  const combined = closureAudit(receipt.combinedOwnerClosure, [
    Number(finalSurfaceOwner.sensibleHeatJm2),
    Number(finalMatrixOwner.sensibleHeatJm2),
    -Number(initialSurfaceOwner.sensibleHeatJm2),
    -Number(initialMatrixOwner.sensibleHeatJm2)
  ]);

  const expectedDirection = heatToMatrixJm2 > 0
    ? 'land-surface-to-deep-subsurface-matrix'
    : heatToMatrixJm2 < 0
      ? 'deep-subsurface-matrix-to-land-surface' : 'none';
  const truthValid =
    receipt.transfer?.direction === expectedDirection &&
    same(receipt.transfer?.signedSurfaceOwnerHeatJm2,
      -heatToMatrixJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfer?.signedDeepSubsurfaceMatrixOwnerHeatJm2,
      heatToMatrixJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    receipt.transfer?.senderOwnerDebited === true &&
    receipt.transfer?.receiverOwnerCredited === true &&
    receipt.truth?.existingSurfaceAndDeepSubsurfaceMatrixOwnersPaired ===
      true &&
    receipt.truth?.exactCoincidentInterfaceUsed === true &&
    receipt.truth?.ownerIntervalsOverlap === false &&
    receipt.truth?.signedSurfaceOwnerEntryApplied === true &&
    receipt.truth?.signedDeepSubsurfaceMatrixOwnerEntryApplied === true &&
    receipt.truth?.surfaceOwnerGeometryUnchangedByThisOrgan === true &&
    receipt.truth?.subsurfaceMatrixGeometryUnchangedByThisOrgan === true &&
    receipt.truth?.bulkInterfaceResponseParameterized === true &&
    receipt.truth?.resolvedSubsurfaceConduction === false &&
    receipt.truth?.geothermalForcingModeledByThisOrgan === false &&
    receipt.truth?.phaseChangeModeledByThisOrgan === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    proposal.truth?.resolvedSubsurfaceConduction === false &&
    proposal.truth?.geothermalForcingModeledByThisProposal === false &&
    proposal.truth?.scientificCalibrationClaimed === false;

  const valid = sourceLineageValid && interfaceValid &&
    proposalRecomputationValid && ownerBindingsValid && paired.valid &&
    surface.valid && matrix.valid && combined.valid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt?.schema || null,
    sourceLineageValid,
    sourceLineageChecks: {
      receiptDigest: receiptDigestValid(receipt),
      budgetReceiptDigest: column?.budget
        ?.surfaceSubsurfaceMatrixThermal?.digest === receipt.digest,
      proposalDigest: receiptDigestValid(proposal),
      sourceR81Digest: receiptDigestValid(sourceR81),
      receiptR81Binding: receipt
        .sourceDeepSoilSubsurfaceMatrixThermal?.receiptDigest ===
          sourceR81?.digest,
      proposalR81Binding: proposal
        ?.sourceDeepSoilSubsurfaceMatrixThermal?.receiptDigest ===
          sourceR81?.digest,
      energySchema: energy.schema === SURFACE_ENERGY_LEDGER_SCHEMA,
      receiptEnergyBinding: embeddedEnergy.bindingDigest ===
        independentlyBoundEnergy.bindingDigest,
      proposalEnergyBinding: proposal
        ?.sourceSurfaceEnergyLedger?.bindingDigest ===
          independentlyBoundEnergy.bindingDigest
    },
    interfaceValid,
    proposalRecomputationValid,
    ownerBindingsValid,
    ownerBindingChecks: {
      energyToInitialSurface: serializedSurfaceOwnersMatch(
        energy.finalSurfaceSensibleHeatOwner, initialSurfaceOwner),
      r81ToInitialMatrix: matrixOwnersMatch(
        sourceR81?.finalDeepSubsurfaceMatrixOwner,
        initialMatrixOwner),
      finalSurfaceToCurrent: surfaceOwnersMatch(
        finalSurfaceOwner, currentSurfaceOwner),
      finalMatrixToCurrent: matrixOwnersMatch(
        finalMatrixOwner, downstreamDeepAquiferMatrixReceipt
          ? downstreamDeepAquiferMatrixReceipt
            .initialDeepSubsurfaceMatrixOwner
          : currentMatrixOwner),
      downstreamR83ToCurrent: downstreamMatrixOwnerBindingValid
    },
    pairedTransferClosure: paired,
    surfaceOwnerClosure: surface,
    deepSubsurfaceMatrixOwnerClosure: matrix,
    combinedOwnerClosure: combined,
    truthValid
  });
}
