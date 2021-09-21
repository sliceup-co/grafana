import { AbsoluteTimeRange, DataQueryResponse, LoadingState, SplitOpen, TimeZone } from '@grafana/data';
import { Button, Collapse, useStyles2, useTheme2 } from '@grafana/ui';
import { ExploreGraph } from './ExploreGraph';
import React from 'react';
import { ExploreId } from '../../types';
import { css } from '@emotion/css';

type Props = {
  exploreId: ExploreId;
  loadLogsVolumeData: (exploreId: ExploreId) => void;
  logsVolumeData?: DataQueryResponse;
  absoluteRange: AbsoluteTimeRange;
  timeZone: TimeZone;
  splitOpen: SplitOpen;
  width: number;
  onUpdateTimeRange: (timeRange: AbsoluteTimeRange) => void;
};

export function LogsVolumePanel(props: Props) {
  const {
    width,
    logsVolumeData,
    exploreId,
    loadLogsVolumeData,
    absoluteRange,
    timeZone,
    splitOpen,
    onUpdateTimeRange,
  } = props;
  const theme = useTheme2();
  const spacing = parseInt(theme.spacing(2).slice(0, -2), 10);
  const styles = useStyles2(getStyles);
  const height = 150;

  let LogsVolumePanelContent;

  if (!logsVolumeData) {
    LogsVolumePanelContent = (
      <Button
        onClick={() => {
          loadLogsVolumeData(exploreId);
        }}
      >
        Load logs volume
      </Button>
    );
  } else if (logsVolumeData?.error) {
    LogsVolumePanelContent = (
      <span>
        Failed to load volume logs for this query:{' '}
        {logsVolumeData.error.data?.message || logsVolumeData.error.statusText}
      </span>
    );
  } else if (logsVolumeData?.state === LoadingState.Loading) {
    LogsVolumePanelContent = <span>Logs volume is loading...</span>;
  } else if (logsVolumeData?.data) {
    if (logsVolumeData.data.length > 0) {
      LogsVolumePanelContent = (
        <ExploreGraph
          loadingState={LoadingState.Done}
          data={logsVolumeData.data}
          height={height}
          width={width - spacing}
          absoluteRange={absoluteRange}
          onChangeTime={onUpdateTimeRange}
          timeZone={timeZone}
          splitOpenFn={splitOpen}
        />
      );
    } else {
      LogsVolumePanelContent = <span>No volume data.</span>;
    }
  }

  return (
    <Collapse label="Logs volume" isOpen={true} loading={logsVolumeData?.state === LoadingState.Loading}>
      <div style={{ height }} className={styles.logsVolumeContainer}>
        {LogsVolumePanelContent}
      </div>
    </Collapse>
  );
}

function getStyles() {
  return {
    logsVolumeContainer: css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),
  };
}
