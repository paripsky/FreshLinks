import { Handlers, PageProps } from "$fresh/server.ts";
import { getLink } from "../../actions/links.ts";
import { FreshLink } from "../../types/link.ts";
import { formatTimeAgo, toDatabaseDate } from "../../utils/date.ts";
import { Chart } from "$fresh_charts/mod.ts";
import { ChartColors, transparentize } from "$fresh_charts/utils.ts";
import { formatDate } from "../../utils/date.ts";
import { addMissingDays } from "../../utils/date.ts";
import { AppState } from "../_middleware.ts";

interface Data {
  link: FreshLink;
}

export const handler: Handlers<Data, AppState> = {
  async GET(req, ctx) {
    if (!ctx.state.user) return ctx.renderNotFound();

    const link = await getLink({ linkId: ctx.params.link });
    if (ctx.state.user.id !== link.createdBy) return ctx.renderNotFound();

    return ctx.render({ link });
  },
};

export default function Analytics({ data }: PageProps<Data>) {
  const visitsByDate = Object.groupBy(
    data.link.visits.toReversed(),
    (visit) => {
      const date = toDatabaseDate(
        visit.visitedAt ? new Date(visit.visitedAt) : new Date(),
      );

      return date;
    },
  );
  const last7Days = Object.keys(visitsByDate).length > 0
    ? addMissingDays(Object.keys(visitsByDate), 7)
    : [];
  const visitsByDateWithMissingDays = last7Days.reduce<Record<string, number>>(
    (acc, date) => {
      acc[date] = visitsByDate[date]?.reduce((acc) => acc + 1, 0) ?? 0;
      return acc;
    },
    {},
  );

  return (
    <div class="flex flex-col gap-2 container m-auto">
      <h1 class="font-bold text-3xl">
        Analytics
      </h1>
      <p>
        {data.link.id} to{" "}
        <a
          href={data.link.url}
          className="text-blue-500 dark:text-blue-300 underline break-all"
        >
          {data.link.url}
        </a>
      </p>

      {data.link.visits
        ? (
          <div class="overflow-auto sm:w-full">
            <Chart
              type="line"
              svgClass="sm:w-full"
              options={{
                devicePixelRatio: 1,
                scales: { y: { beginAtZero: true } },
              }}
              data={{
                labels: Object.keys(visitsByDateWithMissingDays).map((d) =>
                  formatDate(new Date(d))
                ),
                datasets: [
                  {
                    label: "Visits",
                    data: Object.values(visitsByDateWithMissingDays),
                    borderColor: ChartColors.Green,
                    backgroundColor: transparentize(ChartColors.Green, 0.5),
                    borderWidth: 1,
                    segment: {
                      borderColor: (ctx) =>
                        (ctx.p1DataIndex ===
                            Object.values(visitsByDateWithMissingDays).length -
                              1)
                          ? ChartColors.Blue
                          : undefined,
                      borderDash: (ctx) =>
                        (ctx.p1DataIndex ===
                            Object.values(visitsByDateWithMissingDays).length -
                              1)
                          ? [6, 6]
                          : undefined,
                    },
                  },
                ],
              }}
            />
          </div>
        )
        : undefined}

      {data.link.visits.length === 0
        ? <div>No visits yet</div>
        : (
          <div class="relative overflow-x-auto">
            <h2 class="font-semibold text-xl mb-2">Visits</h2>
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Country
                  </th>
                  <th scope="col" class="px-6 py-3">
                    IP
                  </th>
                  <th scope="col" class="px-6 py-3">
                    User Agent
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Referer
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.link.visits.map((visit) => (
                  <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {visit?.visitedAt
                        ? formatTimeAgo(new Date(visit.visitedAt))
                        : "-"}
                    </th>
                    <td class="px-6 py-4">
                      {visit.country ?? "Unknown"}
                    </td>
                    <td class="px-6 py-4">
                      {visit.ip}
                    </td>
                    <td class="px-6 py-4">
                      {visit.userAgent}
                    </td>
                    <td class="px-6 py-4">
                      {visit.referer ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
