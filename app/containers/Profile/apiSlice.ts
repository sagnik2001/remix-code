import { baseApi } from '~/services/api';
import { RequestTypes } from '~/constants/api';
import { clearUser, setUser } from './profileSlice';
import LocalStorage from '~/utils/storage';
import { cacheAddresses } from '~/containers/Address/utils';

const profileApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.mutation({
      query: (payload) => ({
        url: 'me',
        method: RequestTypes.POST,
        body: payload
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          cacheAddresses({data: data, dispatch: dispatch});

          if (data?.have_active_order) LocalStorage.setItem('haveActiveOrder', 'true');
          else LocalStorage.setItem('haveActiveOrder', 'false');
          dispatch(setUser(data));
        } catch (err) {
          LocalStorage.setItem('haveActiveOrder', 'false');
          dispatch(clearUser());
        }
      }
    }),
    reportIssue: builder.mutation({
      query: (payload) => ({
        url: 'app-review',
        method: RequestTypes.POST,
        body: payload
      })
    })
  })
});

export const { useGetProfileMutation, useReportIssueMutation } = profileApis;
