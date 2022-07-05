import { BaseStore, getOrCreateStore } from "next-mobx-wrapper";
import { action, observable } from "mobx";
import { getLogger } from "utils/logging";
import { useStores } from "utils/hooks";
import { useObserver } from "mobx-react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { buildSocketUrl } from "utils/random";

const log = getLogger("StatsStore");

class StatsStore extends BaseStore {
	@observable loading = false;
	@observable previousStats = null;
	@observable stats = null;
	@observable errorMessages = null;

	socket = null;

	openSocket = action((token) => {
		log("Opening socket.");
		if (this.socket !== null) return;
		const socketUrl = buildSocketUrl(`/stats/?token=${token}`);
		this.socket = new ReconnectingWebSocket(socketUrl);
		this.socket.onopen = () => {
			log("Stats socket open.");
		};
		this.socket.onmessage = action((event) => {
			const data = JSON.parse(event.data);
			log(`Event received through WS. (${data.type})`);
			switch (data.type) {
				case "stats.updated":
					if (this.previousStats === null && this.stats === null) {
						this.previousStats = data.payload;
						this.stats = data.payload;
					} else {
						this.previousStats = this.stats;
						this.stats = data.payload;
					}
					break;

				default:
					return;
			}
		});
	});

	closeSocket = () => {
		log("Closing socket.");
		if (this.socket === null) return;
		this.socket.close();
	};
}

export const getStatsStore = getOrCreateStore("stats", StatsStore);

// Hooks

export function useStats() {
	const { stats } = useStores();
	return useObserver(() => ({
		loading: stats.loading,
		stats: stats.stats,
		previousStats: stats.previousStats,
		errorMessages: stats.errorMessages,
	}));
}
