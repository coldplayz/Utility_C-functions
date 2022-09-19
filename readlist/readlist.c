#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <dirent.h>
#include <errno.h>
#include <signal.h>
#include "main.h"

#define ex (execve("/bin/ls", args, NULL) == (-1))
#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))
#define plu(x) (printf("%lu\n", (x)))

int main(int ac __attribute__((unused)), char **av)
{
	char c = 'a', *str, **sarr, *buff;
	int i, fdrd, tbr = 0, br = 0;
	pid_t pid1;

	fdrd = open(av[1], O_RDONLY);
	if (fdrd == -1)
	{
		perror("fdrd");
		return (1);
	}

	buff = malloc(BUFSIZE); /* free buff */
	if (!buff)
	{
		perror("readlist-malloc");
		return (1);
	}

	for (i = 0; (c != '\n'); i++)
	{
		br = read(fdrd, &c, 1);
		if (br == -1)
		{
			perror("readlist-read");
			return (1);
		}
		buff[i] = c;
		tbr += br;
	}
	buff[i] = 0;

	str = strconcatl(3, "vi ", "./", buff); /* free str */
	ps(str);

	sarr = str_arr(str, " \n"); /* free sarr */

	pid1 = fork();
	if (pid1 == -1)
	{
		perror("fork");
		return (1);
	}

	if (pid1 == 0)
	{
		if (execve("/usr/bin/vi", sarr, NULL) == -1)
		{
			perror("execve");
			return (1);
		}
	}
	else
	{
		wait(NULL);
	}

	free(buff);
	free(str);
	free(sarr);
	close(fdrd);

	return (0);
}
