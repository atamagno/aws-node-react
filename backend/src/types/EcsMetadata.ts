export interface ECSTaskMetadata {
  Family: string;
  Revision: string;
  TaskARN: string;
  Cluster: string;
  AvailabilityZone: string;
  DesiredStatus: string;
  KnownStatus: string;
  PullStartedAt?: string;
  PullStoppedAt?: string;
  CreatedAt: string;
  StartedAt?: string;
}

export interface ECSContainerMetadata {
  DockerId: string;
  Name: string;
  DockerName: string;
  Image: string;
  ImageID: string;
  CreatedAt: string;
  StartedAt?: string;
  Type: string;
  Networks?: Record<string, unknown>;
  Health?: Record<string, unknown>;
}

export interface ECSTaskStatsMetadata {
  cpu?: Record<string, unknown>;
  memory?: Record<string, unknown>;
  read?: string;
}
